package com.oasis.oasis.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import com.oasis.oasis.model.TasksModel;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserTasksRepo extends JpaRepository<TasksModel, Long>, JpaSpecificationExecutor<TasksModel> {
    
    List<TasksModel> findByUserId(Integer userId);

    Optional<TasksModel> findBytaskId(String taskId);
}
