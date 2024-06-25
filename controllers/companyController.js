const Company = require('../models/company');

const getCompanyById = async (req,res) => {
    const companyId = req.params.companyId; // Ensure this matches the route definition
    console.log('Fetching company with ID:', companyId); // Debug log

    try {
        const company = await Company.getCompanyById(companyId);
        if (!company) {
            console.log('Company not found for ID:', companyId); // Debug log
            return res.status(404).json({ error: 'Company not found' }); // Return JSON
        }
        res.json(company);
    } catch (error) {
        console.error('Error fetching company:', error);
        res.status(500).json({ error: 'Internal server error' }); // Return JSON
    }
}

module.exports = {
    getCompanyById,
};