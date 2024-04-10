const pdfKit = require('pdfkit');
const fs = require('fs');

exports.generatePdf = (res,incidents) =>{
  

try{
console.log('running');
    const doc = new pdfKit();
        doc.pipe(fs.createWriteStream('incidents.pdf')); // Save PDF to a file
        
        // Add incidents data to PDF
        doc.fontSize(12).text(JSON.stringify(incidents));
        
        // Finalize PDF
        doc.end();
        
        res.sendFile('incidents.pdf', { root: __dirname });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}


function drawTable(doc, table) {
    const tableTop = 200; // Y-coordinate to start the table
    const rowHeight = 20;
    const cellPadding = 10;

    doc.font('Helvetica-Bold').fontSize(12);

    // Draw table headers
    doc.fillColor('black').fillOpacity(1).text(table.headers.join('     '), cellPadding, tableTop, { bold: true });

    
    doc.font('Helvetica').fontSize(10);
    let y = tableTop + rowHeight;
    table.rows.forEach(row => {
        doc.fillColor('black').text(row.join('     '), cellPadding, y);
        y += rowHeight;
    });
}


