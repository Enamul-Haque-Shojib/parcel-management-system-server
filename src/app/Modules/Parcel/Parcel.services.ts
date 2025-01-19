
import AppError from "../../errors/AppError";
import { TParcel } from "./Parcel.interface";
import { ParcelModel } from "./Parcel.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { parcelSearchableField } from "./Parcel.constant";
import { generateParcelNumber } from "./Parcel.utils";


const createParcelIntoDB = async (payload: TParcel) => {
    // const parcelData: Partial<TParcel> = {};
    payload.parcelNumber = await generateParcelNumber();

    const result = await ParcelModel.create(payload);
    return result;
}

const updateParcelIntoDB = async (id: string, payload: Partial<TParcel>) => {
    const updateParcelInfo = await ParcelModel.findByIdAndUpdate(
        id, 
        payload,
        {
            new: true,
        }
    );

    if(!updateParcelInfo){
        throw new AppError(400, 'Failed to update Parcel')
    }

    return updateParcelInfo

}

const getAllParcelsFromDB = async (query: Record<string, unknown>) => {

    const parcelQuery = new QueryBuilder(
        ParcelModel.find(),
        query
    )
    .search(parcelSearchableField)
    .sortAndOrder()
    .paginate()
    .filter();
    const result = parcelQuery.modelQuery;

    // const result = ParcelModel.find().sort('bookingDate');
    return result;
}

const getSingleParcelFromDB = async(id: string) => {
    const deleteParcelInfo = await ParcelModel.findById(id);
    return deleteParcelInfo;
}
const deleteSingleParcelFromDB = async(id: string) => {
    const deleteParcelInfo = await ParcelModel.findByIdAndDelete(id);
    return deleteParcelInfo;
}

export const ParcelServices = {
    createParcelIntoDB,
    updateParcelIntoDB,
    getAllParcelsFromDB,
    deleteSingleParcelFromDB,
    getSingleParcelFromDB
}