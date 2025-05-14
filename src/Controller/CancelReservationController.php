<?php

namespace App\Controller;

use App\Entity\Reservation;

class CancelReservationController
{
    public function __invoke(Reservation $data): Reservation
    {
        $data->setStatus('cancelled');
        return $data;
    }
}
