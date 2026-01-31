import React, { useState, useRef } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { api, updateInvoice } from '../../https';   
import { LuPrinterCheck } from "react-icons/lu";
import '../../index.css';

// Print method (1)Add this function to your component
const handlePrint = () => {
    const printContent = document.getElementById('invoice-print-content');
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // Reload to restore original state
};

// // Add this CSS for print styling
const printStyles = `
    @media print {
        body * {
            visibility: hidden;
        }
        #invoice-print-content, #invoice-print-content * {
            visibility: visible;
        }
        #invoice-print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
        }
        .no-print {
            display: none !important;
        }
    }
`;

const InvoiceDetails = ({ fetchInvoices, id, date, type, shift, length, customer, supplier, payment, total, tax, totalWithTax, payed, balance, status, items }) => {
    
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleOpenModal = async (invoiceId, itemsLength) => {
        console.log('Invoice ID received:', invoiceId);
        console.log('Type of invoiceId:', typeof invoiceId);
        console.log('ID length:', invoiceId.length);

        if (selectedInvoice && selectedInvoice.id === invoiceId) {
            setIsModalOpen(true);
            return;
        }

        setLoading(true);
        try {
            console.log('Fetching invoice for ID:', invoiceId);
            const response = await api.get(`/api/invoice/${invoiceId}`);
            console.log('Full API Response:', response);

            if (response.data && response.data.success) {
                setSelectedInvoice(response.data.data);
                setIsModalOpen(true);
            } else {
                // Handle cases where response structure is different
                const errorMessage = response.data?.message || 'Unknown error occurred';
                console.error('API error details:', response.data);
                toast.error('Failed to load invoice details: ' + errorMessage);
            }
        } catch (error) {
            console.error('Full error object:', error);
            console.error('Error response data:', error.response?.data);
            console.error('Error status:', error.response?.status);

            const errorMessage = error.response?.data?.message ||
                error.message ||
                'Failed to load invoice details';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedInvoice(null);
    };

    // Update orderStatus function
    const handleStatusChange = ({ invoiceId, invoiceStatus }) => {
        invoiceUpdateMutation.mutate({ invoiceId, invoiceStatus });
    };

    const queryClient = useQueryClient();
    const invoiceUpdateMutation = useMutation({
        mutationFn: ({ reqData, invoiceId, invoiceStatus }) => updateInvoice({ reqData, invoiceId, invoiceStatus }),
        onSuccess: (resData) => {
            const { data } = resData.data;
            toast.success('Invoice status updated successfully.');
            queryClient.invalidateQueries(['invoices']);
            fetchInvoices();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update invoice status!');
        }
    });

    return (
        <>
            <tr className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] hover:bg-[#F1E8D9] cursor-pointer'>
                <td className='IdTd p-2 hidden'>{id}</td>
                <td className='p-1'>{new Date(date).toLocaleDateString('en-GB')}</td>
                <td className='p-1'>{type}</td>
                <td className='p-1'>{shift}</td>
                <td
                    className="p-1 cursor-pointer text-blue-500 underline"
                    onClick={() => handleOpenModal(id, length)}
                >
                    {/* {loading ? '...' : length} */}
                    {loading && (
                        <div className="mt-4 flex justify-center">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                            <span className="ml-2 text-blue-500">...</span>
                        </div>
                    )}
                    {length}
                </td>
                <td className='p-1'>{customer}</td>
                <td className='p-1'>{supplier}</td>
                <td className='p-1'>{total.toFixed(2)}</td>
                <td className='p-1'>{tax.toFixed(2)}</td>
                <td className='p-1'>{totalWithTax.toFixed(2)}</td>
                <td className='p-1'>{payed.toFixed(2)}</td>
                <td className={`${balance === '0' ? 'text-green-600' : 'text-red-600'} p-2 text-xs font-semibold border-b border-zinc-100`}>
                    {balance.toFixed(2)}
                </td>
                <td className='updateTd p-1'>
                    <select
                        className={`hide-print cursor-pointer h-6 rounded-sm 
                        ${status === 'Completed' ? "text-green-700 bg-green-100" : "text-[#1a1a1a] bg-orange-200"} 
                        font-normal text-xs`}
                        value={status}
                        onChange={(e) => handleStatusChange({ invoiceId:id, invoiceStatus: e.target.value })}
                    >
                        <option className='text-[#1a1a1a] rounded-lg cursor-pointer' value='In Progress'>In Progress</option>
                        <option className='text-[#1a1a1a] rounded-lg cursor-pointer' value='Completed'>Completed</option>
                    </select>
                </td>
             
            </tr>

            {/* Modal - MOVED OUTSIDE THE TABLE */}
            {/* npm install react-to-print */}
            {/* modal version 1 print  */}
            
            {isModalOpen && (
                <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
                    style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)' }}
                >
                    <style>{printStyles}</style>

                    <div className="bg-white rounded-lg p-3 w-11/12 md:w-3/4 lg:w-1/2 overflow-y-auto h-[calc(100vh)]">
                        {/* Header with print button */}

                        <div className="flex justify-between items-center mb-2 shadow-xl p-1 no-print">
                          
                                <button
                                    onClick={handlePrint}
                                    className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                                >
                                    <LuPrinterCheck className="w-4 h-4" />
                                    طباعه
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="flex justify-end text-gray-500 hover:text-[#be3e3f] text-xl cursor-pointer"
                                >
                                    ✕
                                </button>
                         
                        </div>

                        {/* Print content */}

                        <div id="invoice-print-content">
                            <div className="text-center mb-4">
                                <h2 className="text-xl font-bold">فاتوره</h2>
                                <p className="text-sm">رقم الفاتوره: #{selectedInvoice?.invoiceNumber || selectedInvoice?._id}</p>
                                <p className="text-sm">بتاريخ: {new Date(date).toLocaleDateString('en-GB')}</p>
                            </div>

                            <div className="mb-4 p-2 border-b flex items-center justify-between border border-[#1a1a1a] rounded-sm">
                                <p className="text-sm"><strong>العميل:</strong> {selectedInvoice?.customerName || selectedInvoice?.customer?.customerName || 'N/A'}</p>
                                <p className="text-sm"><strong>عدد الاصناف:</strong> {selectedInvoice?.items?.length || 0}</p>
                            </div>

                            {selectedInvoice?.items && selectedInvoice.items.length > 0 && (
                                <table className="w-full border-collapse mb-4">
                                    <thead>
                                        <tr className="bg-gray-100 text-xs font-normal">
                                            <th className="p-2 border">المنتج</th>
                                            <th className="p-2 border">الكميه</th>
                                            <th className="p-2 border">السعر</th>
                                            <th className="p-2 border">لاجمالي</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedInvoice.items.map((item, index) => (
                                            <tr key={index} className="text-xs font-normal">
                                                <td className="p-2 border">{item.name || item.productName || 'N/A'}</td>
                                                <td className="p-2 border">{item.quantity || 0}</td>
                                                <td className="p-2 border">ج.س {(item.pricePerQuantity || 0).toFixed(2)}</td>
                                                <td className="p-2 border">ج.س {(item.price || 0).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            <div className="flex justify-between items-center p-2 border border-[#1a1a1a] rounded-sm">
                                <div>
                                    <p className="text-sm font-semibold">اجمالي: ج.س {(selectedInvoice?.bills?.total || 0).toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">ضريبه: ج.س {(selectedInvoice?.bills?.tax || 0).toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">اجمالي كلي: ج.س {(selectedInvoice?.bills?.totalWithTax || 0).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )} 
           
        </>
    );
}; 

export default InvoiceDetails;