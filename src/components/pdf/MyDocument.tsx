import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { Electeur } from '../../models/Electeur';


const col = { field: "attr", headerName: "Date de Naissance", minWidth: 180 }

type CellCol = { [key in keyof (typeof col)]?: string }[];
type CellRow = (typeof Electeur.clearData)[];


// Styles du document PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical:40,
  },
  header: {
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 12,
    marginBottom: 10
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
    alignItems: "stretch",

  },
  tableRowHeader: {
    backgroundColor: "#cccccc",
    textTransform: 'capitalize',
    textAlign: "center",
    fontWeight:"bold"
  },
  tableCell: {
    padding: 2,
    borderRightWidth: 1,
    borderColor: '#000000',
    fontSize: 9,
  }
});


type Props = {
  nameCol: CellCol,
  rows: CellRow
}

export const MyDocument = ({ nameCol, rows }: Props) => (
  <Document>
    <Page size="A4" style={styles.page} orientation="landscape">
      <View style={styles.header}>
        <Text style={styles.title}>LISTE DES ELECTEURS</Text>
        <Text style={styles.paragraph}>Liste comportant au total {rows.length} électeurs</Text>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow , styles.tableRowHeader]}>
          {
            nameCol.map((col, ind) => {
              if(col.field==="valider" || col.field ==="sexe"){
                return (
                  <View key={"colPdf" + ind} style={[styles.tableCell, {width:30}]}>
                    <Text style={{ fontWeight: "bold" }} >{col.headerName}</Text>
                  </View>
                )
              }
              else if(col.field==="tel" || col.field==="date_naissance"){
                return (
                  <View key={"colPdf" + ind} style={[styles.tableCell, {width:50}]}>
                    <Text style={{ fontWeight: "bold" }} >{col.headerName}</Text>
                  </View>
                )
              }
              return (
                <View key={"colPdf" + ind} style={[styles.tableCell, {flex:1}]}>
                  <Text style={{ fontWeight: "bold" }} >{col.headerName}</Text>
                </View>
              )
            })
          }
        </View>
        {
          rows.map((row, ind) => {
            return (
              <View style={styles.tableRow} key={"rowPdf" + ind}>
                {
                  nameCol.map((cell, ind2) => {
                    let cell1: keyof typeof row = cell.field as any;
                    if (cell1 === "valider" || cell1 === "sexe") {
                      return (
                        <View style={[styles.tableCell, {width:30}]} key={ind + "cellPdf" + ind2}>
                          <Text>{row[cell1] as string}</Text>
                        </View>
                      )
                    }
                    else if (cell1==="tel" || cell1==="date_naissance"){
                      return (
                        <View style={[styles.tableCell, {width:50}]} key={ind + "cellPdf" + ind2}>
                          <Text>{row[cell1] as any}</Text>
                        </View>
                      )
                    }
                    return (
                      <View style={[styles.tableCell, {flex:1}]} key={ind + "cellPdf" + ind2}>
                        <Text>{row[cell1] as string}</Text>
                      </View>
                    )
                  })
                }
              </View>
            )
          })
        }

      </View>
    </Page>
  </Document>
);

