import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";

export class TaskStatusValidationPipe implements PipeTransform {

  readonly allowedStatus = [
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
    TaskStatus.OPEN
  ];

  transform(status: any) {
    status = status.toUpperCase();

    if (!this.isStatusValid(status)) throw new BadRequestException(`${status} is an invalid status...`);
  }

  private isStatusValid(status: any): Boolean {
    return this.allowedStatus.indexOf(status) !== -1;
  }
}