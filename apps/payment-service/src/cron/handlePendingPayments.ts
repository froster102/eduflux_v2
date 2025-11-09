// import type { IPaymentRepository } from "@repository/PaymentRepository";

// export async function cleanupExpired() {
//   const paymentRepository:IPaymentRepository =
//   const expiryTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours
//   await this.paymentRepository.delete({
//     status: PaymentStatus.PENDING,
//     createdAt: { $lt: expiryTime },
//   });
//   await enrollmentRepository.delete({
//     status: 'PENDING',
//     createdAt: { $lt: expiryTime },
//   });
// }
