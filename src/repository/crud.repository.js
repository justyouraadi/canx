class CrudRepository {
  constructor(model) {
    this.model = model;
  }

  /**
   * Create a new document
   * @param {Object} data - Payload to create
   * @param {Object} [options] - Mongoose create options (e.g., { session })
   */
  async create(data, options = {}) {
    try {
      const result = await this.model.create([data], options);
      // create with array + options returns array
      return Array.isArray(result) ? result[0] : result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find many documents by filter
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [opts]
   * @param {String|Object} [opts.select]
   * @param {Object|String|Array} [opts.populate]
   * @param {Object} [opts.sort]
   * @param {number} [opts.limit]
   * @param {number} [opts.skip]
   * @param {boolean} [opts.lean]
   * @param {Object} [opts.session]
   */
  async find(filter = {}, opts = {}) {
    try {
      let query = this.model.find(filter);
      query = this.#applyQueryOptions(query, opts);
      return await query.exec();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find a single document matching filter
   */
  async findOne(filter = {}, opts = {}) {
    try {
      let query = this.model.findOne(filter);
      query = this.#applyQueryOptions(query, opts);
      return await query.exec();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find a document by id
   */
  async findById(id, opts = {}) {
    try {
      let query = this.model.findById(id);
      query = this.#applyQueryOptions(query, opts);
      return await query.exec();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a document by id and return the updated doc
   * @param {string} id
   * @param {Object} data
   * @param {Object} [opts]
   */
  async updateById(id, data, opts = {}) {
    try {
      const { session, upsert, setDefaultsOnInsert } = opts;
      const updated = await this.model
        .findByIdAndUpdate(id, data, {
          new: true,
          runValidators: true,
          upsert: !!upsert,
          setDefaultsOnInsert: !!setDefaultsOnInsert,
          session,
        })
        .exec();
      return updated;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a single document matching filter
   */
  async updateOne(filter = {}, data = {}, opts = {}) {
    try {
      const { session, upsert, runValidators = true } = opts;
      const res = await this.model
        .updateOne(filter, data, { session, upsert, runValidators })
        .exec();
      return res;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update many documents matching filter
   */
  async updateMany(filter = {}, data = {}, opts = {}) {
    try {
      const { session, upsert, runValidators = true } = opts;
      const res = await this.model
        .updateMany(filter, data, { session, upsert, runValidators })
        .exec();
      return res;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a document by id
   */
  async deleteById(id, opts = {}) {
    try {
      const { session } = opts;
      return await this.model.findByIdAndDelete(id, { session }).exec();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a single document matching filter
   */
  async deleteOne(filter = {}, opts = {}) {
    try {
      const { session } = opts;
      return await this.model.deleteOne(filter, { session }).exec();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete many documents matching filter
   */
  async deleteMany(filter = {}, opts = {}) {
    try {
      const { session } = opts;
      return await this.model.deleteMany(filter, { session }).exec();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Count documents
   */
  async count(filter = {}) {
    try {
      return await this.model.countDocuments(filter).exec();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if a document exists for a given filter
   */
  async exists(filter = {}) {
    try {
      return await this.model.exists(filter).exec();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Run an aggregation pipeline
   */
  async aggregate(pipeline = [], options = {}) {
    try {
      return await this.model.aggregate(pipeline, options).exec();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Apply common query options to a mongoose query
   * @param {*} query
   * @param {*} opts
   * @returns query
   */
  #applyQueryOptions(query, opts = {}) {
    const {
      select,
      populate,
      sort,
      limit,
      skip,
      lean,
      session,
      projection, // alias for select
      options, // passthrough for find/findOne options
    } = opts;

    if (select || projection) query = query.select(select || projection);
    if (populate) query = query.populate(populate);
    if (sort) query = query.sort(sort);
    if (typeof limit === 'number') query = query.limit(limit);
    if (typeof skip === 'number') query = query.skip(skip);
    if (session) query = query.session(session);
    if (lean) query = query.lean();
    if (options) query = query.setOptions(options);

    return query;
  }
}

module.exports = CrudRepository;
