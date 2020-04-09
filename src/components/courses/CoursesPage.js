import React from "react";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as courseActions from "../../redux/actions/courseActions";
import * as authorActions from "../../redux/actions/authorActions";

import CourseList from "./CourseList";
import Spinner from "../common/Spinner";

class CoursesPage extends React.Component {
    state = {
        redirectToAddCoursePage: false
    };

    componentDidMount() {
        const { courses, authors, actions } = this.props;
        if (courses.length === 0) {
            actions.loadCourses().catch(error => {
                alert("Loading courses failed" + error);
            });
        }

        if (authors.length === 0) {
            actions.loadAuthors().catch(error => {
                alert("Loading authors failed" + error);
            });
        }
    }

    handleDeleteCourse = async course => {
        toast.success("Course deleted");
        try {
            await this.props.actions.deleteCourse(course);
        }
        catch (error) {
            toast.error("Delete failed. " + error.message, { autoClose: false });
        }

    }

    render() {
        return <>
            {this.state.redirectToAddCoursePage && <Redirect to="/course" />}
            <h2>Courses</h2>
            {this.props.looading ? (
                <Spinner />
            ) : (
                    <>
                        <button style={{ marginBottom: 20 }}
                            className="btn btn-primary add-course"
                            onClick={() => this.setState({ redirectToAddCoursePage: true })}>
                            Add Course
                            </button>
                        <CourseList onDeleteClick={this.handleDeleteCourse} courses={this.props.courses} />
                    </>
                )
            }
        </>
    }
}

function mapStateToProps(state) {
    return {
        courses: state.authors.length === 0
            ? []
            : state.courses.map(course => {
                return {
                    ...course,
                    authorName: state.authors.find(a => a.id === course.authorId).name
                };
            }),
        authors: state.authors,
        looading: state.apiCallsInProgress > 0,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            loadCourses: bindActionCreators(courseActions.loadCourses, dispatch),
            loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
            deleteCourse: bindActionCreators(courseActions.deleteCourse, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);