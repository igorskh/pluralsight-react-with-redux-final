import React from "react";
import { newCourse, courses, authors } from "../../../tools/mockData";
import { mount } from "enzyme";
import { ManageCoursePage } from "./ManageCoursePage";

function render(args) {
    const defaultProps = {
        authors,
        courses,
        history: {},
        match: {},
        course: newCourse,
        saveCourse: () => { },
        loadCourses: () => { },
        loadAuthors: () => { }
    };

    const props = { ...defaultProps, ...args };
    return mount(<ManageCoursePage {...props} />);
}

it("sets error when attempting to save an empty title field", () => {
    const wrapper = render();
    wrapper.find("form").simulate("submit");
    const error = wrapper.find(".alert").first();
    expect(error.text()).toBe("Title is required!");
})