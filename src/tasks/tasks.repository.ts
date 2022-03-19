import { InternalServerErrorException, Logger } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskFilterDto } from "./dto/task-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository', { timestamp: true });

  async getTasks(taskFilterDto: TaskFilterDto, user: User): Promise<Task[]> {
    const { status, search } = taskFilterDto;

    const query = this.createQueryBuilder('task');

    query.where({ user });

    if (status) query.andWhere('task.status = :status', { status });

    if (search)
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', { search: `%${search}%` }
      );

    try {
      const tasks = await query.getMany();

      return tasks;
    } catch (error) {
      this.logger.error(`
        Failed to get task for user ${user.username}  
      `, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task: Task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user
    });

    await this.save(task);
    return task;
  }
}