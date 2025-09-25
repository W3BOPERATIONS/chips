"use client"

import html2pdf from "html2pdf.js"
import { toast } from "react-toastify"

const InvoiceGenerator = ({ orderData, onClose }) => {
  const generateInvoice = () => {
    const invoiceContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${orderData.orderId}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background-color: #f8f9fa;
            color: #333;
            line-height: 1.6;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          .header { 
            text-align: center; 
            margin-bottom: 40px; 
            border-bottom: 3px solid #4f46e5;
            padding-bottom: 20px;
          }
          .company-name { 
            font-size: 36px; 
            font-weight: bold; 
            color: #4f46e5; 
            margin-bottom: 8px;
            letter-spacing: -1px;
          }
          .company-tagline {
            color: #6b7280;
            font-size: 16px;
            margin-bottom: 15px;
            font-style: italic;
          }
          .invoice-title { 
            font-size: 28px; 
            margin: 20px 0; 
            color: #1f2937;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .invoice-details { 
            display: flex; 
            justify-content: space-between; 
            margin: 30px 0; 
            gap: 30px;
          }
          .customer-details, .invoice-info { 
            width: 48%; 
            background: #f8f9fa;
            padding: 25px;
            border-radius: 10px;
            border: 1px solid #e5e7eb;
          }
          .customer-details h3, .invoice-info h3 {
            color: #4f46e5;
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 18px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
            font-weight: 600;
          }
          .customer-details p, .invoice-info p {
            margin-bottom: 8px;
            font-size: 14px;
          }
          .table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 30px 0; 
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
          }
          .table th, .table td { 
            border: 1px solid #e5e7eb; 
            padding: 15px 12px; 
            text-align: left; 
            font-size: 14px;
          }
          .table th { 
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 0.5px;
          }
          .table tbody tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          .table tbody tr:hover {
            background-color: #e0e7ff;
          }
          .total-section { 
            text-align: right; 
            margin-top: 30px; 
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
          }
          .total-row { 
            font-weight: bold; 
            font-size: 20px; 
            color: #4f46e5;
            border-top: 2px solid #4f46e5;
            padding-top: 10px;
            margin-top: 10px;
          }
          .footer { 
            margin-top: 50px; 
            text-align: center; 
            color: #6b7280; 
            border-top: 2px solid #e5e7eb;
            padding-top: 20px;
          }
          .footer h4 {
            color: #4f46e5;
            margin-bottom: 10px;
          }
          .payment-status {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
          }
          .payment-cod {
            background-color: #fef3c7;
            color: #92400e;
          }
          .payment-online {
            background-color: #d1fae5;
            color: #065f46;
          }
          .highlight {
            background-color: #eff6ff;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #4f46e5;
            margin: 20px 0;
          }
          @media print {
            body { background-color: white; padding: 0; }
            .invoice-container { box-shadow: none; border: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="company-name">ChipsStore</div>
            <div class="company-tagline">Premium Chips & Snacks Delivered Fresh</div>
            <div class="invoice-title">INVOICE</div>
          </div>

          <div class="invoice-details">
            <div class="customer-details">
              <h3>📋 Bill To:</h3>
              <p><strong>${orderData.customerName}</strong></p>
              <p>📧 ${orderData.email}</p>
              <p>📱 ${orderData.phone}</p>
              <p>📍 ${orderData.address}</p>
            </div>
            <div class="invoice-info">
              <h3>📄 Invoice Details:</h3>
              <p><strong>Invoice #:</strong> INV-${orderData.orderId}</p>
              <p><strong>Order #:</strong> ${orderData.orderId}</p>
              <p><strong>Date:</strong> ${orderData.date || new Date().toLocaleDateString()}</p>
              <p><strong>Payment:</strong> 
                <span class="payment-status ${orderData.paymentMethod === "cod" ? "payment-cod" : "payment-online"}">
                  ${orderData.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
                </span>
              </p>
              ${
                orderData.paymentDetails?.transactionId
                  ? `<p><strong>Transaction ID:</strong> ${orderData.paymentDetails.transactionId}</p>`
                  : ""
              }
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>🛍️ Item</th>
                <th style="text-align: center;">📦 Qty</th>
                <th style="text-align: right;">💰 Unit Price</th>
                <th style="text-align: right;">💵 Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderData.items
                .map(
                  (item) => `
                <tr>
                  <td><strong>${item.name}</strong></td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">₹${item.price.toFixed(2)}</td>
                  <td style="text-align: right;"><strong>₹${(item.price * item.quantity).toFixed(2)}</strong></td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>

          <div class="total-section">
            <p>Subtotal: <strong>₹${orderData.subtotal.toFixed(2)}</strong></p>
            <p>Tax (8%): <strong>₹${orderData.tax.toFixed(2)}</strong></p>
            <p>Delivery: <strong style="color: #059669;">Free</strong></p>
            <p class="total-row">Total Amount: ₹${orderData.totalAmount.toFixed(2)}</p>
          </div>

          <div class="highlight">
            <p style="color: #4f46e5; font-weight: 600; margin-bottom: 10px;">📦 Order Status: Processing</p>
            <p style="font-size: 14px; color: #374151;">Your order is being carefully prepared and will be delivered within 2-3 business days. You'll receive tracking information once shipped.</p>
          </div>

          <div class="footer">
            <h4>🙏 Thank you for choosing ChipsStore!</h4>
            <p><strong>ChipsStore</strong> - Premium Chips & Snacks</p>
            <p>📧 support@chipsstore.com | 📞 +91-9876543210</p>
            <p>🌐 www.chipsstore.com</p>
            <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
              This is a computer-generated invoice. No signature required.<br>
              Generated on ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </body>
      </html>
    `

    const printWindow = window.open("", "_blank")
    printWindow.document.write(invoiceContent)
    printWindow.document.close()
    printWindow.print()
  }

  const downloadInvoice = async () => {
    try {
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice - ${orderData.orderId}</title>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 30px; 
              background-color: #ffffff;
              color: #333;
              line-height: 1.6;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 40px;
              border: 2px solid #e5e7eb;
              border-radius: 10px;
            }
            .header { 
              text-align: center; 
              margin-bottom: 40px; 
              border-bottom: 3px solid #4f46e5;
              padding-bottom: 20px;
            }
            .company-name { 
              font-size: 36px; 
              font-weight: bold; 
              color: #4f46e5; 
              margin-bottom: 8px;
              letter-spacing: -1px;
            }
            .company-tagline {
              color: #6b7280;
              font-size: 16px;
              margin-bottom: 15px;
              font-style: italic;
            }
            .invoice-title { 
              font-size: 28px; 
              margin: 20px 0; 
              color: #1f2937;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .invoice-details { 
              display: flex; 
              justify-content: space-between; 
              margin: 40px 0; 
              gap: 30px;
            }
            .customer-details, .invoice-info { 
              width: 48%; 
              background: #f8f9fa;
              padding: 25px;
              border-radius: 10px;
              border: 1px solid #e5e7eb;
            }
            .customer-details h3, .invoice-info h3 {
              color: #4f46e5;
              margin-top: 0;
              margin-bottom: 15px;
              font-size: 18px;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 8px;
              font-weight: 600;
            }
            .customer-details p, .invoice-info p {
              margin-bottom: 8px;
              font-size: 14px;
            }
            .table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 40px 0; 
              background: white;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              overflow: hidden;
            }
            .table th, .table td { 
              border: 1px solid #e5e7eb; 
              padding: 15px 12px; 
              text-align: left; 
              font-size: 14px;
            }
            .table th { 
              background: linear-gradient(135deg, #4f46e5, #7c3aed);
              color: white;
              font-weight: 600;
              text-transform: uppercase;
              font-size: 12px;
              letter-spacing: 0.5px;
            }
            .table tbody tr:nth-child(even) {
              background-color: #f8f9fa;
            }
            .table tbody tr:hover {
              background-color: #f1f5f9;
            }
            .total-section { 
              text-align: right; 
              margin-top: 40px; 
              background: #f8f9fa;
              padding: 25px;
              border-radius: 10px;
              border: 1px solid #e5e7eb;
            }
            .total-section p {
              margin-bottom: 8px;
              font-size: 16px;
            }
            .total-row { 
              font-weight: bold; 
              font-size: 22px; 
              color: #4f46e5;
              border-top: 2px solid #4f46e5;
              padding-top: 12px;
              margin-top: 12px;
            }
            .footer { 
              margin-top: 50px; 
              text-align: center; 
              color: #6b7280; 
              border-top: 2px solid #e5e7eb;
              padding-top: 25px;
            }
            .footer h4 {
              color: #4f46e5;
              margin-bottom: 15px;
              font-size: 20px;
            }
            .footer p {
              margin-bottom: 8px;
              font-size: 14px;
            }
            .payment-status {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 15px;
              font-weight: 600;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .payment-cod {
              background-color: #fef3c7;
              color: #92400e;
              border: 1px solid #f59e0b;
            }
            .payment-online {
              background-color: #d1fae5;
              color: #065f46;
              border: 1px solid #10b981;
            }
            .highlight {
              background-color: #eff6ff;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #4f46e5;
              margin: 20px 0;
            }
            @media print {
              body { padding: 0; }
              .invoice-container { border: none; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <div class="company-name">ChipsStore</div>
              <div class="company-tagline">Premium Chips & Snacks Delivered Fresh</div>
              <div class="invoice-title">INVOICE</div>
            </div>

            <div class="invoice-details">
              <div class="customer-details">
                <h3>📋 Bill To:</h3>
                <p><strong>${orderData.customerName}</strong></p>
                <p>📧 ${orderData.email}</p>
                <p>📱 ${orderData.phone}</p>
                <p>📍 ${orderData.address}</p>
              </div>
              <div class="invoice-info">
                <h3>📄 Invoice Details:</h3>
                <p><strong>Invoice #:</strong> INV-${orderData.orderId}</p>
                <p><strong>Order #:</strong> ${orderData.orderId}</p>
                <p><strong>Date:</strong> ${orderData.date || new Date().toLocaleDateString()}</p>
                <p><strong>Payment:</strong> 
                  <span class="payment-status ${orderData.paymentMethod === "cod" ? "payment-cod" : "payment-online"}">
                    ${orderData.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
                  </span>
                </p>
                ${
                  orderData.paymentDetails?.transactionId
                    ? `<p><strong>Transaction ID:</strong> ${orderData.paymentDetails.transactionId}</p>`
                    : ""
                }
              </div>
            </div>

            <table class="table">
              <thead>
                <tr>
                  <th>🛍️ Item</th>
                  <th style="text-align: center;">📦 Qty</th>
                  <th style="text-align: right;">💰 Unit Price</th>
                  <th style="text-align: right;">💵 Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderData.items
                  .map(
                    (item) => `
                  <tr>
                    <td><strong>${item.name}</strong></td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td style="text-align: right;">₹${item.price.toFixed(2)}</td>
                    <td style="text-align: right;"><strong>₹${(item.price * item.quantity).toFixed(2)}</strong></td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>

            <div class="total-section">
              <p>Subtotal: <strong>₹${orderData.subtotal.toFixed(2)}</strong></p>
              <p>Tax (8%): <strong>₹${orderData.tax.toFixed(2)}</strong></p>
              <p>Delivery: <strong style="color: #059669;">Free</strong></p>
              <p class="total-row">Total Amount: ₹${orderData.totalAmount.toFixed(2)}</p>
            </div>

            <div class="highlight">
              <p style="color: #4f46e5; font-weight: 600; margin-bottom: 10px;">📦 Order Status: Processing</p>
              <p style="font-size: 14px; color: #374151;">Your order is being carefully prepared and will be delivered within 2-3 business days. You'll receive tracking information once shipped.</p>
            </div>

            <div class="footer">
              <h4>🙏 Thank you for choosing ChipsStore!</h4>
              <p><strong>ChipsStore</strong> - Premium Chips & Snacks</p>
              <p>📧 support@chipsstore.com | 📞 +91-9876543210</p>
              <p>🌐 www.chipsstore.com</p>
              <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                This is a computer-generated invoice. No signature required.<br>
                Generated on ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </body>
        </html>
      `

      const element = document.createElement("div")
      element.innerHTML = invoiceHTML

      const opt = {
        margin: 0.5,
        filename: `ChipsStore-Invoice-${orderData.orderId}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      }

      html2pdf().set(opt).from(element).save()
      toast.success("PDF invoice downloaded successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Error generating PDF. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  const emailInvoice = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderData.orderId}/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: orderData.email,
          customerName: orderData.customerName,
        }),
      })

      if (response.ok) {
        toast.success(`Invoice has been sent successfully to ${orderData.email}!`, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } else {
        const errorData = await response.json()
        if (errorData.message === "Email already sent") {
          toast.info(`Email has already been sent to ${orderData.email}!`, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          })
        } else {
          throw new Error(errorData.message || "Failed to send email")
        }
      }
    } catch (error) {
      console.error("Error sending email:", error)
      toast.error(`Failed to send email: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoice Ready</h2>
          <p className="text-gray-600">Your invoice has been generated successfully</p>

          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Invoice #:</strong> INV-{orderData.orderId}
              </p>
              <p>
                <strong>Amount:</strong> ₹{orderData.totalAmount.toFixed(2)}
              </p>
              <p>
                <strong>Items:</strong> {orderData.items.length} item(s)
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={generateInvoice}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            <span>Print Invoice</span>
          </button>

          <button
            onClick={downloadInvoice}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Download Invoice</span>
          </button>

          <button
            onClick={emailInvoice}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>Email Invoice</span>
          </button>

          <button
            onClick={onClose}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default InvoiceGenerator
