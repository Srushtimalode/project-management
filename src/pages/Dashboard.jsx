
import React, { useEffect, useState } from "react";
import "./Dashboard.css";

import {
  getAllProject,
  deleteProject,
  updateProject,
} from "../api/projectAPI";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // Fetch All Projects
  async function fetchAllData() {
    try {
      const projectsData = await getAllProject();
      setProjects(Array.isArray(projectsData) ? projectsData : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  useEffect(() => {
    fetchAllData();
  }, []);

  // Edit Project
  async function handleEdit(project) {
    const newName = prompt(
      "Enter Project Name",
      project.ProjectName || ""
    );

    if (newName === null || !newName.trim()) return;

    try {
      const updatedProject = {
        ...project,
        ProjectName: newName.trim(),
      };

      const response = await updateProject(
        project.id,
        updatedProject
      );

      const finalProject =
        response && response.id != null
          ? response
          : updatedProject;

      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? finalProject : p
        )
      );

      alert("Project updated successfully!");
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Unable to update project.");
    }
  }

  // Delete Project
  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    try {
      await deleteProject(id);

      setProjects((prev) =>
        prev.filter((project) => project.id !== id)
      );

      alert("Project deleted successfully!");
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Unable to delete project.");
    }
  }

  // Update Project Status
  async function handleStatus(project) {
    const newStatus = prompt(
      "Enter Status: Pending, In Progress, Completed",
      project.status || "Pending"
    );

    if (newStatus === null || !newStatus.trim()) return;

    const validStatuses = [
      "Pending",
      "In Progress",
      "Completed",
    ];

    const status = validStatuses.find(
      (item) =>
        item.toLowerCase() === newStatus.trim().toLowerCase()
    );

    if (!status) {
      alert("Please enter Pending, In Progress, or Completed.");
      return;
    }

    try {
      const updatedProject = {
        ...project,
        status,
      };

      const response = await updateProject(
        project.id,
        updatedProject
      );

      const finalProject =
        response && response.id != null
          ? response
          : updatedProject;

      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? finalProject : p
        )
      );

      alert("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Unable to update status.");
    }
  }

  // Search and Filters
  const filteredProjects = projects.filter((project) => {
    const searchText = search.toLowerCase().trim();

    const matchSearch =
      (project.ProjectName || "")
        .toLowerCase()
        .includes(searchText) ||
      (project.Department || "")
        .toLowerCase()
        .includes(searchText);

    const matchStatus =
      statusFilter === "All" ||
      (project.status || "").toLowerCase() ===
        statusFilter.toLowerCase();

    const matchPriority =
      priorityFilter === "All" ||
      (project.priority || "").toLowerCase() ===
        priorityFilter.toLowerCase();

    return matchSearch && matchStatus && matchPriority;
  });

  // Reset Search and Filters
  function handleReset() {
    setSearch("");
    setStatusFilter("All");
    setPriorityFilter("All");
  }

  return (
    <div className="dashboard-page">
      {/* Dashboard Heading */}
     <div className="container-fluid px-4 dashboard-heading">
        <h2>Project Dashboard</h2>
        <p>Manage and track all your projects in one place.</p>
      </div>

      {/* Search and Filters */}
      <div className="container my-4">
        <div className="dashboard-toolbar">
          <div className="toolbar-search">
            <input
              type="text"
              className="form-control"
              placeholder="Search project or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="toolbar-filter">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="toolbar-filter">
            <select
              className="form-select"
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value)
              }
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <button
            type="button"
            className="btn btn-outline-secondary reset-btn"
            onClick={handleReset}
          >
            Reset
          </button>

          <button
            type="button"
            className="btn btn-primary add-project-btn"
            onClick={() =>
              alert("Connect your Add Project page here.")
            }
          >
            + Add Project
          </button>
        </div>
      </div>

      {/* Projects Table */}
      <div className="container mt-4 mb-5">
        <div className="project-table-card">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Project Name</th>
                  <th>Department</th>
                  <th>Priority</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProjects.map((project, index) => (
                  <tr key={project.id}>
                    <td>{index + 1}</td>

                    <td className="project-name">
                      {project.ProjectName || "N/A"}
                    </td>

                    <td>{project.Department || "N/A"}</td>

                    <td>
                      <span
                        className={`priority-badge ${(
                          project.priority || ""
                        ).toLowerCase()}`}
                      >
                        {project.priority || "N/A"}
                      </span>
                    </td>

                    <td>{project.startDate || "N/A"}</td>

                    <td>{project.EndDate || "N/A"}</td>

                    <td>
                      <span
                        className={`status-badge ${(
                          project.status || ""
                        )
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {project.status || "N/A"}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="btn btn-edit"
                          onClick={() => handleEdit(project)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-delete"
                          onClick={() =>
                            handleDelete(project.id)
                          }
                        >
                          Delete
                        </button>

                        <button
                          type="button"
                          className="btn btn-status"
                          onClick={() => handleStatus(project)}
                        >
                          Update Status
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredProjects.length === 0 && (
                  <tr>
                    <td colSpan="8" className="empty-message">
                      No projects found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

