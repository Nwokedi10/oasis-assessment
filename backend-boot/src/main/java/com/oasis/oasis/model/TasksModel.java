package com.oasis.oasis.model;

import java.sql.Timestamp;

import com.oasis.oasis.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tasks")
public class TasksModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "task_id", nullable = false)
    private String taskId;

    @Column(name = "description")
    private String description;

    @Column(name = "category")
    private String category;

    @Column(name = "due_date")
    private Timestamp dueDate;

    @Column(name = "priority", length = 50, nullable = false, columnDefinition = "varchar default 'Low'")
    private String priority;

    @Column(name = "completed", nullable = false, columnDefinition = "boolean default false")
    private boolean completed;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public TasksModel() {
    }

    public TasksModel(String title, String taskId, String description, String category, Timestamp dueDate, String priority, boolean completed, User user) {
        this.title = title;
        this.taskId = taskId;
        this.description = description;
        this.category = category;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
        this.user = user;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
    public String getTaskId() {
        return taskId;
    }
    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }

    public Timestamp getDueDate() {
        return dueDate;
    }

    public void setDueDate(Timestamp dueDate) {
        this.dueDate = dueDate;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "TasksModel{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", taskId='" + taskId + '\'' +
                ", description='" + description + '\'' +
                ", category='" + category + '\'' +
                ", dueDate=" + dueDate +
                ", priority='" + priority + '\'' +
                ", completed=" + completed +
                '}';
    }

}
