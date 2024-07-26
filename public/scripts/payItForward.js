document.addEventListener('DOMContentLoaded', async (e) => {
    e.preventDefault();

    // pay payment request
    async function pay(paymentRequestId) {
        const elementid = "pr-" + paymentRequestId + "-amount";
        console.log(elementid);
        const amount = document.getElementById(elementid).value;
        console.log(amount);

        const response = await fetch(`/api/paymentRequest/pay`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ paymentRequestId, amount }),
        });

        if (response.status === 200) {
            console.log('payment successful');
            alert("Payment Successful!");
        }
    }

    // fill payment request list with valid payment requests
    const fetchPaymentRequests = await fetch(`/api/paymentRequests`, {
        method: 'GET'
    });

    const paymentRequestsJson = await fetchPaymentRequests.json();
    let paymentRequests = paymentRequestsJson.paymentRequests;

    if (paymentRequests.length > 0) {

        for (const paymentRequest of paymentRequests) {
            console.log(paymentRequest)
            document.getElementById("paymentRequests").innerHTML += `
                <div class="flex-grow bg-white shadow-lg rounded-lg max-w-8xl p-6 m-4" ">
                    <div class="flex flex-col">
                        <a class="text-2xl"><span class="font-bold">Payment Details</a>
                        
                        <a class="text-1xl font-bold">Message from the requester</a>
                        ${paymentRequest.PaymentRequestMessage}
                        <a class="text-1xl font-bold">Requested Payment Amount: ${paymentRequest.TotalCost}</a>
                        <a class="text-1xl font-bold"> Amount Paid: ${paymentRequest.PaymentPaidAmount}</a>
                        <a class="text-1xl font-bold">Pay this amount: 
                        <input type="number" min="0.01" step="0.01" max="${paymentRequest.TotalCost} - ${paymentRequest.PaymentPaidAmount}" value="5" id="pr-${paymentRequest.PaymentRequestId}-amount"/><span class="font-bold"></a>
                    </div>

                    <div class="flex space-x-3">
                    <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" id="${paymentRequest.PaymentRequestId}">Pay</button>
                    </div>
                </div>
            `;
            const tempId = paymentRequest.PaymentRequestId;
            const element = document.getElementById(tempId);
            element.addEventListener("click", () => pay(tempId));
        }
    } else {
        document.getElementById("paymentRequests").innerHTML += `<p>No Payment Requests Available </p>`
    }

});


