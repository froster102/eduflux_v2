import { Button } from '@heroui/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';

import { PaymentType } from '@/shared/enums/PaymentType';

interface PaymentModalProps {
  paymentType: PaymentType;
  checkoutItem: CheckoutItem;
  isPending?: boolean;
  isOpen: boolean;
  onClose: () => void;
  isCheckoutItemLoading: boolean;
  onPayment: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  isPending,
  onPayment,
  isCheckoutItemLoading,
}: PaymentModalProps) {
  return (
    <Modal
      backdrop="blur"
      classNames={{
        backdrop: 'bg-background/80 backdrop-opacity-50',
      }}
      isOpen={isOpen}
      size="2xl"
      onClose={onClose}
      onOpenChange={onClose}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex  flex-col gap-1">
              <p>Payment</p>
              <small className="text-sm text-default-500">
                Please continue with the payment process
              </small>
            </ModalHeader>
            <ModalBody>
              {isCheckoutItemLoading ? <p>Loading...</p> : <form />}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" isLoading={isPending} onPress={onPayment}>
                Continue
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
