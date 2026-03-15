import {
  IAdvisoryRequestGateway,
  IAdvisoryRequest,
  IGetAllAdvisoryRequestsUseCase,
} from '@bandi/interfaces';

/**
 * Get All Advisory Requests Use Case
 * Retrieves all advisory requests
 */
export class GetAllAdvisoryRequestsUseCase implements IGetAllAdvisoryRequestsUseCase {
  constructor(private readonly advisoryRequestGateway: IAdvisoryRequestGateway) {}

  async execute(): Promise<IAdvisoryRequest[]> {
    return this.advisoryRequestGateway.findAll();
  }
}
