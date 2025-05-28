<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
#[\Attribute(\Attribute::TARGET_CLASS)]
class NoOverlappingReservation extends Constraint
{
    public string $message = 'Pojazd jest już zarezerwowany w tym czasie.';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
