package com.oasis.oasis.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import com.oasis.oasis.exception.ResourceNotFoundException;
import com.oasis.oasis.model.TaskData;
import com.oasis.oasis.model.TasksModel;
import com.oasis.oasis.repository.UserTasksRepo;
import com.oasis.oasis.user.User;
import com.oasis.oasis.user.UserRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@CrossOrigin
@RequestMapping("/api/v1/account")
public class TasksController {
    
    @Autowired
    private UserTasksRepo userTasksRepo;
    @Autowired
    private UserRepository userRepository;
@Autowired
private EntityManager entityManager;


    @PostMapping("/addTask/{emailAddress}")
    public ResponseEntity<?> createTask(@PathVariable String emailAddress, @RequestBody TasksModel tasksModel) {
        try {

            String emailFromToken = getAuthenticatedUserEmail();
        
            if (!emailAddress.equals(emailFromToken)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You cannot make such request");
            }
            if (!isValidTasksModel(tasksModel)) {
                return ResponseEntity.badRequest().body("Form fields contain invalid input data");
            }
            TasksModel sanitizedTasksModel = sanitizeTasksModel(tasksModel);
            @SuppressWarnings("null")
            TasksModel savedTask = userTasksRepo.save(sanitizedTasksModel);
            return ResponseEntity.ok(savedTask);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing the request");
        }
    }
   
    @GetMapping("/tasks/{emailAddress}")
    public ResponseEntity<List<TaskData>> getUserTasks(@PathVariable String emailAddress) {
        try {
            String emailFromToken = getAuthenticatedUserEmail();
            if (!emailAddress.equals(emailFromToken)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            Optional<User> userOptional = userRepository.findByEmailAddress(emailAddress);
            if (!userOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            
            User user = userOptional.get();
            Integer userId = user.getId();
            
            List<TasksModel> tasks = userTasksRepo.findByUserId(userId);
            
            List<TaskData> allTasks = tasks.stream()
                .map(task -> {
                    TaskData dto = new TaskData();
                    dto.setId(task.getId());
                    dto.setTitle(task.getTitle());
                    dto.setTaskId(task.getTaskId());
                    dto.setDescription(task.getDescription());
                    dto.setCategory(task.getCategory());
                    dto.setDueDate(task.getDueDate());
                    dto.setPriority(task.getPriority());
                    dto.setCompleted(task.isCompleted());
                    return dto;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(allTasks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/userTask/{taskId}/{emailAddress}")
    public ResponseEntity<TasksModel> getUserTask(@PathVariable String taskId, @PathVariable String emailAddress) {
        try {
            String emailFromToken = getAuthenticatedUserEmail();
            if (!emailAddress.equals(emailFromToken)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            TasksModel newTask = userTasksRepo.findBytaskId(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task does not exist"));
            
            return ResponseEntity.ok(newTask);
        } catch (ResourceNotFoundException e) {
            TasksModel errorTask = new TasksModel();
            errorTask.setTitle("Error");
            errorTask.setDescription("You do not have any task with this id");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorTask);
        } catch (Exception e) {
            TasksModel errorTask = new TasksModel();
            errorTask.setTitle("Error");
            errorTask.setDescription("An error occurred while processing the request");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorTask);
        }
    }

    @PutMapping("updateTask/{taskId}/{emailAddress}")
    public ResponseEntity<TasksModel> updateUserTask(@PathVariable String taskId, @PathVariable String emailAddress, @RequestBody TasksModel tasksDetails) {
        try {
            String emailFromToken = getAuthenticatedUserEmail();
            if (!emailAddress.equals(emailFromToken)) {
                TasksModel errorTask = new TasksModel();
                errorTask.setTitle("Error");
                errorTask.setDescription("You cannot modify this task");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorTask);
            } else if (!isValidTasksModel2(tasksDetails)) {
                TasksModel errorTask = new TasksModel();
                errorTask.setTitle("Error");
                errorTask.setDescription("Form contains invalid input types");
                return ResponseEntity.badRequest().body(errorTask);
            } else if(!tasksDetails.isCompleted() && tasksDetails.getDueDate().before(new Date())){
                TasksModel errorTask = new TasksModel();
                errorTask.setTitle("Error");
                errorTask.setDescription("Date cannot be set to past date without marking task as complete");
                return ResponseEntity.badRequest().body(errorTask);
            }

            TasksModel newTask = userTasksRepo.findBytaskId(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task does not exist"));

            newTask.setTitle(tasksDetails.getTitle());
            newTask.setCategory(tasksDetails.getCategory());
            newTask.setDescription(tasksDetails.getDescription());
            newTask.setDueDate(tasksDetails.getDueDate());
            newTask.setPriority(tasksDetails.getPriority());
            newTask.setCompleted(tasksDetails.isCompleted());
            TasksModel updatedTask = userTasksRepo.save(newTask);
            return ResponseEntity.ok(updatedTask);
        } catch(ResourceNotFoundException e) {
            TasksModel errorTask = new TasksModel();
            errorTask.setTitle("Error");
            errorTask.setDescription("Task not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorTask);
        } catch(Exception e) {
            TasksModel errorTask = new TasksModel();
            errorTask.setTitle("Error");
            errorTask.setDescription("An error occurred while processing the request");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorTask);
        }
    }
    
    @DeleteMapping("/deleteTask/{taskId}/{emailAddress}")
    public ResponseEntity<Map<String, Boolean>> deleteTask(@PathVariable String taskId, @PathVariable String emailAddress){
        try {
            String emailFromToken = getAuthenticatedUserEmail();
            if (!emailAddress.equals(emailFromToken)) {
                Map<String, Boolean> response = new HashMap<>();
                response.put("status", Boolean.FALSE);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            TasksModel newTask = userTasksRepo.findBytaskId(taskId)
            .orElseThrow(() -> new ResourceNotFoundException("Task do not exist"));

                userTasksRepo.delete(newTask);
                Map<String, Boolean> response = new HashMap<>();
                response.put("deleted", Boolean.TRUE);
                return ResponseEntity.ok(response);
        } catch (Exception e){
            Map<String, Boolean> response = new HashMap<>();
                response.put("status", Boolean.FALSE);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/search/{term}/{emailAddress}")
    public ResponseEntity<List<TaskData>> getSearchTasks(@PathVariable String term, @PathVariable String emailAddress) {
        try {
            String emailFromToken = getAuthenticatedUserEmail();
            if (!emailAddress.equals(emailFromToken)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            Optional<User> userOptional = userRepository.findByEmailAddress(emailAddress);
            if (!userOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            
            User user = userOptional.get();
            Integer userId = user.getId();
            
            Specification<TasksModel> spec = (root, query, cb) -> {
                CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
                List<Predicate> predicates = new ArrayList<>();
                predicates.add(criteriaBuilder.equal(root.get("userId"), userId)); 
                predicates.add(criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" + term.toLowerCase() + "%"),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), "%" + term.toLowerCase() + "%")
                ));
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            };
            
            List<TasksModel> tasks = userTasksRepo.findAll(spec);
            
            List<TaskData> allTasks = tasks.stream()
                .map(task -> {
                    TaskData dto = new TaskData();
                    dto.setId(task.getId());
                    dto.setTitle(task.getTitle());
                    dto.setTaskId(task.getTaskId());
                    dto.setDescription(task.getDescription());
                    dto.setCategory(task.getCategory());
                    dto.setDueDate(task.getDueDate());
                    dto.setPriority(task.getPriority());
                    dto.setCompleted(task.isCompleted());
                    return dto;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(allTasks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    public String getAuthenticatedUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            return userDetails.getUsername(); 
        }
        
        return null; 
    }

    private TasksModel sanitizeTasksModel(TasksModel tasksModel) {
        tasksModel.setDescription(sanitizeString(tasksModel.getDescription()));
        tasksModel.setPriority(sanitizeString(tasksModel.getPriority()));
        tasksModel.setCategory(sanitizeString(tasksModel.getCategory()));
        tasksModel.setTitle(sanitizeString(tasksModel.getTitle()));
        return tasksModel;
    }

    private boolean isValidTasksModel(TasksModel tasksModel) {
        if (tasksModel.getTitle() == null || tasksModel.getTitle().isEmpty() || containsSpecialCharacters(tasksModel.getTitle())) {
            return false;
        }
        
        if (tasksModel.getDescription() == null || tasksModel.getDescription().isEmpty()) {
            return false;
        }
        
        if (tasksModel.getDueDate() == null || tasksModel.getDueDate().before(new Date())) {
            return false;
        }
        return true;
    }
    private boolean isValidTasksModel2(TasksModel tasksModel) {
        if (tasksModel.getTitle() == null || tasksModel.getTitle().isEmpty() || containsSpecialCharacters(tasksModel.getTitle())) {
            return false;
        }
        
        if (tasksModel.getDescription() == null || tasksModel.getDescription().isEmpty()) {
            return false;
        }
        
        return true;
    }

    private String sanitizeString(String input) {
        return input.replaceAll("[^a-zA-Z0-9.,!? ]", "");
    }
    
    private boolean containsSpecialCharacters(String input) {
        return !input.matches("[a-zA-Z0-9.,!? ]*");
    }
    
}
