export class WarehouseTable {
    id: any;
    name: any;
    country: any;
    countryId: any;
    city: any;
    address: any;

    constructor(warehouseObj: any) {
        this.id = warehouseObj.id;
        this.name =  warehouseObj.name;
        this.country =  warehouseObj.country;
        this.countryId =  warehouseObj.countryId;
        this.city =  warehouseObj.city;
        this.address =  warehouseObj.address;
    }
}