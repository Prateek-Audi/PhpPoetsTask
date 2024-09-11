import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Typography,
  Container,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Modal,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  SelectChangeEvent,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  AddCircle,
} from "@mui/icons-material";
import Sidebar from "./Sidebar";
import SearchIcon from "@mui/icons-material/Search";
import { Task, TaskPriority, TaskStatus } from "../types/task";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskServices";
import { toast } from "react-toastify";

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTask, setNewTask] = useState<Task>({
    _id: "",
    title: "",
    description: "",
    priority: "Low",
    status: "Pending",
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [errors, setErrors] = useState<{ title: boolean; description: boolean }>({
    title: false,
    description: false,
  });
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await getTasks();
      if (Array.isArray(fetchedTasks)) {
        setTasks(fetchedTasks);
      } else {
        console.error("Fetched tasks is not an array:", fetchedTasks);
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      alert(
        "Failed to fetch tasks. Please check your authentication or network."
      );
    }
  };

  const handleOpen = (task?: Task) => {
    if (task) {
      setNewTask(task);
      setIsEditing(true);
    } else {
      setNewTask({
        _id: "",
        title: "",
        description: "",
        priority: "Low",
        status: "Pending",
      });
      setIsEditing(false);
    }   
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewTask({
      _id: "",
      title: "",
      description: "",
      priority: "Low",
      status: "Pending",
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  
    if (name in errors) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name as keyof typeof prevErrors]: false,
      }));
    }
  };

  const handlePriorityChange = (e: SelectChangeEvent<TaskPriority>) => {
    setNewTask({ ...newTask, priority: e.target.value as TaskPriority });
  };

  const handleStatusChange = (e: SelectChangeEvent<TaskStatus>) => {
    setNewTask({ ...newTask, status: e.target.value as TaskStatus });
  };

  const validateTaskForm = () => {
    let valid = true;
    const newErrors = {
      title: false,
      description: false,
    };

    if (!newTask.title.trim()) {
      newErrors.title = true;
      valid = false;
    }
    if (!newTask.description.trim()) {
      newErrors.description = true;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };
  
  const handleSaveTask = async () => {
    if (!validateTaskForm()) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    try {

    if (isEditing) {
      if (newTask._id) {
        await updateTask(newTask._id, newTask);
        setTasks(
          tasks.map((task) => (task._id === newTask._id ? newTask : task))
        );
      } else {
        console.error("Task _id is undefined");
      }
    } else {
      const createdTask = await createTask(newTask);
      setTasks([...tasks, { ...newTask, _id: createdTask._id }]);
    }
    handleClose();
  } catch (error) {
    console.error("Error saving task:", error);
    toast.error("Failed to save task. Please try again.");
  }
  };

  const handleOpenDeleteConfirm = (id: string) => {
    setTaskToDelete(id);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setTaskToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete);
      setTasks(tasks.filter((task) => task._id !== taskToDelete));
      handleCloseDeleteConfirm();
    }
  };

  const handleDeleteTask = (id: string) => {
    handleOpenDeleteConfirm(id);
  };

  return (
    <Box display="flex" height="100vh">
      <Sidebar />
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <Container
          maxWidth="lg"
          sx={{
            maxHeight: "90vh",
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "#888 #f1f1f1",
            "::-webkit-scrollbar": { width: "6px" },
            "::-webkit-scrollbar-track": { backgroundColor: "#f1f1f1" },
            "::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "10px",
            },
            "::-webkit-scrollbar-thumb:hover": { backgroundColor: "#555" },
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            sx={{
              borderBottom: "1px solid #ccc",
              paddingBottom: "8px",
              position: "relative",
            }}
          >
            <Typography variant="h4" sx={{ py: 2 }}>
              Task Management List
            </Typography>
            <TextField
              placeholder="Search for tasks"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                borderRadius: "4px",
                backgroundColor: "#f2f2f2",
                width: "24rem",
                "& .MuiOutlinedInput-root": {
                  height: "35px",
                  "& fieldset": { border: "none" },
                  "&:hover fieldset": { border: "none" },
                  "&.Mui-focused fieldset": { border: "none" },
                },
                "& .MuiInputBase-input": {
                  padding: "8px 0px",
                  fontSize: "12px",
                  paddingLeft: "0px",
                  lineHeight: "18px",
                },
                "& .MuiInputBase-input::placeholder": {
                  fontSize: "12px",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: "16px", color: "#888" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box
            sx={{
              maxHeight: "calc(100vh - 227px)",
              overflowY: "auto",
              paddingRight: "8px",
              scrollbarWidth: "thin",
              scrollbarColor: "#888 #f1f1f1",
            }}
          >
            <TableContainer component={Paper}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Description
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      <IconButton color="primary" onClick={() => handleOpen()}>
                        <AddCircle />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(tasks) && tasks.length > 0 ? (
                    tasks.map((task) => (
                      <TableRow key={task._id}>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{task.description}</TableCell>
                        <TableCell>{task.priority}</TableCell>
                        <TableCell>{task.status}</TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleOpen(task)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => {
                              if (task._id) {
                                handleDeleteTask(task._id);
                              } else {
                                console.error("Task _id is undefined");
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No tasks found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" mb={2}>
            {isEditing ? "Edit Task" : "Add New Task"}
          </Typography>
          <TextField
            label="Title"
            name="title"
            value={newTask.title}
            onChange={handleInputChange}
            fullWidth
            error={errors.title}
              helperText={errors.title ? "Title is required" : ""}
              sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            value={newTask.description || ""}
            onChange={handleInputChange}
            fullWidth
            error={errors.description}
              helperText={errors.description ? "Description is required" : ""}
              sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select value={newTask.priority} onChange={handlePriorityChange}>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select value={newTask.status} onChange={handleStatusChange}>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveTask}
            >
              {isEditing ? "Save Changes" : "Add Task"}
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={openDeleteConfirm} onClose={handleCloseDeleteConfirm}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" mb={2}>
            Confirm Delete
          </Typography>
          <Typography mb={2}>
            Are you sure you want to delete this task?
          </Typography>
          <Box display="flex" justifyContent="space-between">
            <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>

    </Box>
  );
};

export default Dashboard;
