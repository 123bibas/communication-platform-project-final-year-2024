const advancedResults = (model, populate) => async (req, res, next) => {
    let query;
    // Copy req.query
    const reqQuery = { ...req.query };
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    // Finding resource
    query = model.find(JSON.parse(queryStr));
    if (req.query.search) {
        query = query.find({ name: { $regex: new RegExp(req.query.search), $options: "i" } })
    }
    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy).collation({ locale: 'en', strength: 2 });
    } else {
        query = query.sort('-createdAt');
    }
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 2;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    query = query.skip(startIndex).limit(limit);
    if (populate) {
        query = query.populate(populate);
    }
    // Executing query
    const results = await query;
    // const total = await model.countDocuments();
    let total
    if (req.query.search) {
        total = await model.countDocuments({ name: { $regex: new RegExp(req.query.search), $options: "i" } })
    }
    else {
        total = await model.countDocuments();
    }
    // Pagination result
    let pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
        console.log("pagination", pagination)
    }
    res.advancedResults = {
        success: true,
        count: results.length,
        message: "Paginated Results",
        pagination,
        data: results
    };
    next();
};
module.exports = advancedResults;
