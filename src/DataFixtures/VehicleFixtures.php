<?php

namespace App\DataFixtures;

use App\Entity\Vehicle;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class VehicleFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $vehiclesData = [
            ['Opel', 'Insignia', 'K1 KAPPA', true, 1.0, 1.0, 15],
            ['Volkswagen', 'Golf', 'KRX45675', true, 50.08, 19.92, 30],
            ['Toyota', 'Auris', 'STOPHYBRIDGOSMOG', true, 1.0, 1.0, 5],
            ['Volkswagen', 'Polo', 'K1 FERRARI', true, 2.0, 2.0, 5],
            ['Toyota', 'Yaris', 'KRA12345', true, 50.06, 19.94, 5],
            ['Opel', 'Astra J', 'KRA XD', true, 2.0, 2.0, 10],
        ];

        foreach ($vehiclesData as [$brand, $model, $plate, $available, $lat, $lon, $price]) {
            $vehicle = new Vehicle();
            $vehicle->setBrand($brand);
            $vehicle->setModel($model);
            $vehicle->setLicensePlate($plate);
            $vehicle->setAvailable($available);
            $vehicle->setLatitude($lat);
            $vehicle->setLongitude($lon);
            $vehicle->setPricePerHour($price);

            $manager->persist($vehicle);
        }

        $manager->flush();
    }
}
