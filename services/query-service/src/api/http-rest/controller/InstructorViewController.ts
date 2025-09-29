import { authenticaionMiddleware } from "@api/http-rest/middleware/authenticationMiddleware";
import { getInstructorViewSchema } from "@api/http-rest/validation/instructorViewSchema";
import { InstructorViewDITokens } from "@core/application/instructor-view/di/InstructorViewDITokens";
import type { GetInstructorViewsUseCase } from "@core/application/instructor-view/usecase/GetInstructorViewsUseCase";
import type { GetInstructorViewUseCase } from "@core/application/instructor-view/usecase/GetInstructorViewUseCase";
import Elysia from "elysia";
import { inject } from "inversify";

export class InstructorViewController {
  constructor(
    @inject(InstructorViewDITokens.GetInstructorViewsUseCase)
    private readonly getInstructorViewsUseCase: GetInstructorViewsUseCase,
    @inject(InstructorViewDITokens.GetInstructorViewUseCase)
    private readonly getInstructorViewUseCase: GetInstructorViewUseCase,
  ) {}

  register(): Elysia {
    return new Elysia().group("/api/query/instructors", (app) =>
      app
        .use(authenticaionMiddleware)
        .get("/", async ({ query, user }) => {
          const parsedQuery = getInstructorViewSchema.parse(query);
          const { instructors, totalCount } =
            await this.getInstructorViewsUseCase.execute({
              executorId: user.id,
              queryParameters: {
                limit: parsedQuery.limit,
                offset: (parsedQuery.page - 1) * parsedQuery.limit,
              },
            });

          return {
            pagination: {
              totalPages: Math.ceil(totalCount / parsedQuery.limit),
              currentPage: parsedQuery.page,
            },
            instructors,
          };
        })
        .get("/:id", async ({ params }) => {
          const instructor = await this.getInstructorViewUseCase.execute({
            instructorId: params.id,
          });

          return JSON.stringify(instructor);
        }),
    );
  }
}
