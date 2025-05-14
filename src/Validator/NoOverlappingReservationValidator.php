namespace App\Validator;

use App\Entity\Reservation;
use App\Repository\ReservationRepository;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

class NoOverlappingReservationValidator extends ConstraintValidator
{
    public function __construct(private ReservationRepository $reservationRepository) {}

    public function validate(mixed $value, Constraint $constraint): void
    {
        if (!$constraint instanceof NoOverlappingReservation) {
            throw new UnexpectedTypeException($constraint, NoOverlappingReservation::class);
        }

        if (!$value instanceof Reservation) {
            return;
        }

        $start = $value->getStartTime();
        $end = $value->getEndTime();
        $vehicle = $value->getVehicle();

        if (!$start || !$end || !$vehicle) {
            return;
        }

        $conflicts = $this->reservationRepository->createQueryBuilder('r')
            ->andWhere('r.vehicle = :vehicle')
            ->andWhere('r.endTime > :start AND r.startTime < :end')
            ->setParameters([
                'vehicle' => $vehicle,
                'start' => $start,
                'end' => $end,
            ])
            ->getQuery()
            ->getResult();

        if (count($conflicts) > 0) {
            $this->context->buildViolation($constraint->message)->addViolation();
        }
    }
}
