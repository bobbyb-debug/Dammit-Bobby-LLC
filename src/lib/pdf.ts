
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Invoice, CompanyInfo } from "@/types";
import { format } from "date-fns";
import { companyInfo } from "./data";

export const generateInvoicePDF = async (invoiceId: string, elementId: string): Promise<void> => {
  try {
    // Get the invoice element
    const invoiceElement = document.getElementById(elementId);
    if (!invoiceElement) {
      throw new Error("Invoice element not found");
    }

    // Create a clone of the element to modify for PDF
    const clone = invoiceElement.cloneNode(true) as HTMLElement;
    
    // Temporarily append to body with absolute positioning off-screen
    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    clone.style.top = "-9999px";
    // Set white background and black text
    clone.style.backgroundColor = "white";
    clone.style.color = "black";
    document.body.appendChild(clone);

    // Capture the element as an image
    const canvas = await html2canvas(clone, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: "#ffffff"
    });

    // Clean up the clone
    document.body.removeChild(clone);

    // Calculate PDF dimensions (A4)
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let position = 0;

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4");
    
    // Add image to PDF
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

    // Save the PDF
    pdf.save(`invoice-${invoiceId}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
