import React from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  table: {
    //@ts-ignore
    display: "flex",
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row'
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    marginBottom: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCellHeader: {
    fontWeight: 'bold'
  }
});

export const MyPDF = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Mon tableau PDF</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.tableCellHeader]}>
                <Text>En-tête 1</Text>
              </View>
              <View style={[styles.tableCell, styles.tableCellHeader]}>
                <Text>En-tête 2</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text>Ligne 1, Cellule 1</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>Ligne 1, Cellule 2</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text>Ligne 2, Cellule 1</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>Ligne 2, Cellule 2</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
