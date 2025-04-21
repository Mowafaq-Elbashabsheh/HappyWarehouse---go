export class ItemTable {
    id: any;
    name: any;
    warehouse: any;
    //WarehouseId: any;
    quantity: any;
    costPrice: any;
    msrpPrice: any;
    skuName: any;

    constructor(itemObj: any) {
        this.id = itemObj.id;
        this.name =  itemObj.name;
        this.warehouse =  itemObj.warehouse;
        //this.WarehouseId =  itemObj.warehouseId;
        this.quantity =  itemObj.quantity;
        this.costPrice =  itemObj.costPrice;
        this.msrpPrice =  itemObj.msrpPrice;
        this.skuName =  itemObj.skuName;
    }
}