
import axiosinstance from "./axiosinstance";

export async function getAllProject() {
  try {
    const res = await axiosinstance.get("/projects");
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteProject(ID) {
  try {
    await axiosinstance.delete(`/projects/${ID}`);
    return "Project Deleted Successfully";
  } catch (error) {
    throw error;
  }
}

// Update Project
export async function updateProject(ID, updatedProject) {
  try {
    const res = await axiosinstance.put(
      `/projects/${ID}`,
      updatedProject
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

