import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const search = this.query?.search;
    if (search) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: search, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }

    return this;
  }

  sortAndOrder() {
    const sortField = this.query?.sort as string;
    const sortOrder = this.query?.order === 'desc' ? -1 : 1; //

    if (sortField) {
      this.modelQuery = this.modelQuery.sort({ [sortField]: sortOrder });
    }

    return this;
  }

  paginate() {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  filter() {
    const queryObj = { ...this.query };

    const excludeFields = ['searchTerm', 'sort', 'order', 'limit', 'page'];
    excludeFields.forEach((el) => delete queryObj[el]);

    const filters: Record<string, unknown> = {};

    // Special handling for `participants`
    if (queryObj.participants) {
      const participants = Array.isArray(queryObj.participants)
        ? queryObj.participants
        : [queryObj.participants];

      filters.$or = participants.map((participant) => ({
        participants: { $regex: participant, $options: 'i' }, // Use $regex to perform partial matches
      }));
    }

    // Add other filters
    Object.keys(queryObj).forEach((key) => {
      if (key !== 'participants') {
        filters[key] = queryObj[key];
      }
    });

    // Apply filters to the query
    this.modelQuery = this.modelQuery.find(filters as FilterQuery<T>);

    return this;
  }
}

export default QueryBuilder;
