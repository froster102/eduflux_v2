export interface GetInstructorPricingOutputDto {
  id: string;
  price: number;
  currency: string;
  duration: number;
}

export interface IUserServiceGateway {
  getUserDetails(userId: string): Promise<User>;
  getInstructorSessionPricng(
    userId: string,
  ): Promise<GetInstructorPricingOutputDto>;
}
