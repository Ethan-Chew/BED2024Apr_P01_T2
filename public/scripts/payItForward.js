document.addEventListener('DOMContentLoaded', async () => {

    // fill payment request list with valid payment requests
    const fetchPaymentRequests = await fetch(`/api/paymentRequests`, {
        method: 'GET'
    });

    const paymentRequestsJson = await fetchPaymentRequests.json();
    let paymentRequests = paymentRequestsJson.paymentRequests;
    console.log(paymentRequests);

    if (paymentRequests.length > 0) {

        for (const paymentRequest of paymentRequests) {
            console.log(paymentRequest)
            document.getElementById("paymentRequests").innerHTML += `
                <div class="flex flex-col align-top bg-gray-100 p-5 rounded-xl gap-10" id="appt-${paymentRequest.AppointmentId}">
                    <div class="flex flex-col">
                        <a class="text-2xl"><span class="font-bold">${new Date(paymentRequest.SlotDate).toISOString().split("T")[0]}</span> | ${paymentRequest.SlotTime}</a>
                        <a class="text-2xl"><span class="font-bold">
                        <a class="text-xl">${paymentRequest.Reason}</a>
                    </div>

                    <div class="flex space-x-4">
                        <button class="flex-1 py-2 bg-red-300 rounded-lg hover:bg-red-400" id="appt-cancel-${paymentRequest.AppointmentId}">Cancel</button>
                        <button class="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400" id="appt-reschedule-${paymentRequest.AppointmentId}">Reschedule</button>
                        <button class="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400" id="appt-view-${paymentRequest.AppointmentId}">View</button>
                    </div>
                </div>
            `;
        }
    } else {
        document.getElementById("paymentRequests").innerHTML += ``
    }

});