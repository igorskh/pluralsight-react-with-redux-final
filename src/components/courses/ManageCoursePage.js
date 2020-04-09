import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";

import { connect } from "react-redux";
import * as courseActions from "../../redux/actions/courseActions";
import * as authorActions from "../../redux/actions/authorActions";
import CourseForm from "./CourseForm"
import Spinner from "../common/Spinner";

export function ManageCoursePage({
    courses,
    authors,
    loadCourses,
    loadAuthors,
    saveCourse,
    history,
    ...props
}) {
    const [course, setCourse] = useState({ ...props.course });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCourse(prevCourse => ({
            ...prevCourse,
            [name]: name === "authorId" ? parseInt(value, 10) : value
        }));
    };

    const handleSave = (event) => {
        event.preventDefault();
        if (!formIsValid()) return;
        setSaving(true);
        saveCourse(course).then(() => {
            toast.success("Course saved");
            history.push("/courses");
        }).catch(error => {
            setSaving(false);
            setErrors({ onSave: error.message });
        });
    }

    const formIsValid = () => {
        const { title, authorId, category } = course;
        const errors = {};

        if (!title) errors.title = "Title is required!";
        if (!authorId) errors.author = "Author is required!";
        if (!category) errors.category = "Category is required!";

        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    useEffect(() => {
        if (courses.length === 0) {
            loadCourses().catch(error => {
                alert("Loading courses failed" + error);
            });
        } else {
            setCourse({ ...props.course })
        }

        if (authors.length === 0) {
            loadAuthors().catch(error => {
                alert("Loading authors failed" + error);
            });
        }
    }, [props.course, courses, authors, loadCourses, loadAuthors]);

    return (
        authors.length === 0 || courses.length === 0 ? (<Spinner />) :
            <CourseForm
                onChange={handleChange}
                onSave={handleSave}
                course={course}
                errors={errors}
                authors={authors}
                saving={saving}
            />
    );
}

export function getCourseBySlug(courses, slug) {
    return courses.find(course => course.slug === slug) || null;
}

function mapStateToProps(state, ownProps) {
    const slug = ownProps.match.params.slug;
    const course = slug && state.courses.length > 0 ? getCourseBySlug(state.courses, slug) : null;

    return {
        course,
        courses: state.courses,
        authors: state.authors
    }
}

const mapDispatchToProps = {
    loadCourses: courseActions.loadCourses,
    loadAuthors: authorActions.loadAuthors,
    saveCourse: courseActions.saveCourse,
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(ManageCoursePage);