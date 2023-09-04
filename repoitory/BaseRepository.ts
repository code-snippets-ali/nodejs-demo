import { FilterQuery, Model, UpdateQuery } from "mongoose";
import { IBaseModel } from "../database/IBaseModel";

export class BaseRepository<T extends IBaseModel> {
    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async getAll(): Promise<T[]> {
        return await this.model.find();
    }

    async getById(id: string): Promise<T | null> {
        return await this.model.findById(id);
    }

    async create(item: T): Promise<T> {
        return await this.model.create(item);
    }

    async update(id: string, update: UpdateQuery<T>): Promise<T | null> {
        return await this.model.findByIdAndUpdate(id, update, { new: true });
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id);
        if (result) {
            return true;
        }
        return false;
    }

    async find(query: FilterQuery<T>): Promise<T[]> {
        return await this.model.find(query);
    }
}
