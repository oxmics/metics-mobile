import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list';
import { BASE_URL } from '@env';
import axios from "axios";

const BuyerDashboard: React.FC = () => {
  const [isSwitchEnabled, setIsSwitchEnabled] = React.useState(false);
  const [selectedMonth, setSelectedMonth] = React.useState<string | null>(null);
  const navigation = useNavigation();

  const toggleSwitch = () => {
    setIsSwitchEnabled(previousState => {
      const newState = !previousState;
      if (newState) {
        navigation.navigate('SupplierDashboard'); 
      }
      return newState;
    });
  };

  const fetchDashboardData = async () => {
    const response = await axios.get(`${BASE_URL}dashboard/`);
    return response.data;
  };

  // Sample recent updates data
  const recentUpdates = [
    { message: 'New message from auction creator', daysAgo: '3 days ago' },
    { message: 'Cancellation request', daysAgo: '16 days ago' },
    { message: 'Bid submitted', daysAgo: '18 days ago' },
    { message: 'Order Request', daysAgo: '20 days ago' },
    { message: 'Bid Awarded', daysAgo: '25 days ago' },
  ];
  // Array of months for the dropdown
  const monthOptions = [
    { key: '1', value: 'January' },
    { key: '2', value: 'February' },
    { key: '3', value: 'March' },
    { key: '4', value: 'April' },
    { key: '5', value: 'May' },
    { key: '6', value: 'June' },
    { key: '7', value: 'July' },
    { key: '8', value: 'August' },
    { key: '9', value: 'September' },
    { key: '10', value: 'October' },
    { key: '11', value: 'November' },
    { key: '12', value: 'December' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header with Toggle Switch */}
        <View style={styles.header}>
          <Icon name="menu" size={30} />
          <Text style={styles.headerText}>Dashboard</Text>
          <Switch
            value={isSwitchEnabled}
            onValueChange={toggleSwitch}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isSwitchEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        {/* Overview Section Heading */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <SelectList
            setSelected={setSelectedMonth} 
            data={monthOptions}
            save="key"
            placeholder="Select Month"
            dropdownStyles={styles.dropdown} 
            boxStyles={styles.dropdownBox} 
            dropdownTextStyles={styles.dropdownText} 
          />
        </View>

        {/* Overview Section */}
        <View style={styles.overview}>
          {/* Total Active RFQs */}
          <View style={styles.overviewCard}>
            <Text style={styles.cardTitle}>Total Active RFQs</Text>
            <Text style={styles.cardNumber}>8</Text>
            <View style={styles.percentageContainer}>
              <Text style={styles.percentageText}>+7.5%</Text>
            </View>
            <Text style={styles.cardFooter}>Completed 3</Text>
          </View>

          {/* Total Suppliers< Card */}
          <View style={styles.overviewCard}>
            <Text style={styles.cardTitle}>Total Suppliers</Text>
            <Text style={styles.cardNumber}>5</Text>
            <View style={styles.percentageContainer}>
              <Text style={styles.percentageText}>+7.5%</Text>
            </View>
            <Text style={styles.cardFooter}>Recently Added 3</Text>
          </View>
        </View>

        {/* Quick Action Section Heading */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Action</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Icon name="file-document" size={24} color="green" />
            <Text>View RFQ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Icon name="account-plus" size={24} color="green" />
            <Text>Add New User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Icon name="cart" size={24} color="green" />
            <Text>View Purchase Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Icon name="currency-usd" size={24} color="green" />
            <Text>International fund transfer</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Updates */}
        <View style={styles.recentUpdates}>
          <Text style={styles.sectionTitle}>Recent Updates</Text>
          {recentUpdates.map((update, index) => (
            <View key={index} style={styles.updateCard}>
              <Text style={styles.updateMessage}>{update.message}</Text>
              <Text style={styles.updateDate}>{update.daysAgo}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation - Permanent */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity>
          <Icon name="home" size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="file-document" size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="cart" size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="cog" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingBottom: 100, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  overview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  overviewCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardTitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  cardNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  percentageContainer: {
    backgroundColor: '#E0F7E9',
    borderRadius: 5,
    padding: 3,
    marginVertical: 5,
  },
  percentageText: {
    color: 'green',
    fontSize: 12, 
  },
  cardFooter: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  quickActionButton: {
    padding: 20,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,      
    borderColor: '#ccc', 
  },
  recentUpdates: {
    padding: 16,
  },
  updateCard: {
    backgroundColor: '#fff', 
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,  
    borderColor: '#e0e0e0', 
    borderWidth: 1, 
  },
  updateMessage: {
    fontSize: 16, 
    color: '#333', 
    fontWeight: '500',
    marginBottom: 4,
  },
  updateDate: {
    color: '#888',
    fontSize: 13,
    fontWeight: '400',
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  dropdown: {
    position: 'absolute',
    top: 0,
    right:100 ,
    width: 120, 
    zIndex: 1, 
  },
  dropdownBox: {
    width: '70%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8, 
    right:20,
  },
  dropdownText: {
    fontSize: 14,
  },
});

export default BuyerDashboard;
