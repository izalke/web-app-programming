namespace App\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class NoOverlappingReservation extends Constraint
{
    public string $message = 'Pojazd jest już zarezerwowany w tym czasie.';
}
