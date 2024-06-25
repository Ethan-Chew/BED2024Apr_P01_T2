const DrugRequest = require('../models/drugRequestModel');

const getAllDrugRequestOrder = async (req, res) => {
    try {
        const drugRequests = await DrugRequest.getAllDrugRequestOrder();
        if (!drugRequests) {
            res.status(404).json({
                message: `No drug requests found`
            });
            return;
        }

        const drugRequestHtml = drugRequests.map((drugRequest) => {
            return `
              <div class="flex flex-row px-6 py-4 gap-8">
                <div class="flex flex-col gap-y-4">
                  <!-- Medicine Name -->
                  <div>
                    <p class="font-bold">Medicine Name</p>
                    <p class="text-xl" id="request-name-${drugRequest.appointmentId}">${drugRequest.drugName}</p>
                  </div>
                  <!-- Quantity Requested -->
                  <div>
                    <p class="font-bold">Quantity Requested</p>
                    <p class="text-xl" id="request-quantity-${drugRequest.appointmentId}">${drugRequest.drugQuantity}</p>
                  </div>
                  <!-- Price -->
                  <div>
                    <p class="font-bold">Price/Unit</p>
                    <p class="text-xl" id="request-price-${drugRequest.appointmentId}">$${drugRequest.drugPrice}</p>
                  </div>
                </div>
                
                <div class="flex flex-col gap-y-4">
                  <!-- Order ID -->
                  <div>
                    <p class="font-bold">Order ID</p>
                    <p class="text-xl" id="request-order-${drugRequest.appointmentId}">${drugRequest.orderID}</p>
                  </div>
                  <!-- Date of Request -->
                  <div>
                    <p class="font-bold">Date of Request</p>
                    <p class="text-xl" id="request-date-${drugRequest.appointmentId}">${drugRequest.requestDate}</p>
                  </div>
                </div>
                
                <!-- Button -->
                <div>
                  <a class="bg-btnprimary text-white px-6 py-4 rounded-2xl font-bold text-center" href="requestConfirmation.html" id="request-contribute-${drugRequest.orderID}">Contribute</a>
                </div>
              </div>
            `;
          }).join('');

        res.status(200).json({
            message: "Drug Requests Found",
            drugRequests: drugRequests,
            drugRequestHtml
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
    
}

module.exports = {
    getAllDrugRequestOrder
}