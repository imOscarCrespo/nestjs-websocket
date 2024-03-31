/* eslint-disable no-console */
import mongoose, { Document } from 'mongoose';

export class MongoDBConnection {
  private static instance: MongoDBConnection;
  private readonly connectionString: string;
  private readonly dbName: string;

  public constructor() {
    this.connectionString = process.env.DATABASE_URL;
    this.dbName = process.env.DATABASE_PARAMS;
  }

  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }

    return MongoDBConnection.instance;
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(`${this.connectionString}/${this.dbName}`, {
        maxPoolSize: 10,
      });
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }

  public createSchema<T extends Document>(
    name: string,
    schemaDefinition: unknown,
  ): mongoose.Model<T> {
    const schema = new mongoose.Schema(schemaDefinition);

    return mongoose.model<T>(name, schema);
  }

  public getSchema<T extends Document>(
    name: string,
  ): mongoose.Model<T> | undefined {
    return mongoose.model<T>(name);
  }
}
