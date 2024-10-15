import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list';

const SupplierDashboard: React.FC = () => {
  const [isSwitchEnabled, setIsSwitchEnabled] = React.useState(false);
  const [selectedMonth, setSelectedMonth] = React.useState<string | null>(null);
  const navigation = useNavigation();

  const toggleSwitch = () => {
    setIsSwitchEnabled(previousState => {
      const newState = !previousState;
      if (!newState) {
        navigation.navigate('BuyerDashboard');
      }
      return newState;
    });
  };

  // Sample data for recent updates
  const recentUpdates = [
    'New message from auction creator',
    'Cancellation request',
    'Bid submitted',
    'Order Request',
    'Bid Awarded',
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
      <ScrollView style={styles.scrollContainer}>
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
          <View style={styles.overviewCard}>
            <Text style={styles.overviewTitle}>Total Active Requests</Text>
            <Text style={styles.overviewNumber}>8</Text>
            <View style={styles.percentageContainer}>
              <Text style={styles.percentageText}>+7.5%</Text>
            </View>
            <Text style={styles.overviewCompleted}>Completed 3</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewTitle}>Total Clients</Text>
            <Text style={styles.overviewNumber}>5</Text>
            <View style={styles.percentageContainer}>
              <Text style={styles.percentageText}>+7.5%</Text>
            </View>
            <Text style={styles.overviewAdded}>Recently Added 3</Text>
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
            <Text>View Request</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Icon name="account-cash" size={24} color="green" />
            <Text>View Bids</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Icon name="cart" size={24} color="green" />
            <Text>View Purchase Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Icon name="plus-box" size={24} color="green" />
            <Text>Add Product</Text>
          </TouchableOpacity>
        </View>


        {/* Recent Updates */}
        <View style={styles.recentUpdates}>
          <Text style={styles.sectionTitle}>Recent Updates</Text>
          {recentUpdates.map((message, index) => (
            <View key={index} style={styles.updateCard}>
              <Text>{message}</Text>
              <Text style={styles.updateDate}>{`${3 + index * 5} days ago`}</Text>
            </View>
          ))}
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
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
    flex: 1,
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
    padding: 16,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  overviewTitle: {
    fontSize: 14,
    color: '#777',
  },
  overviewNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  percentageContainer: {
    backgroundColor: '#e0f7ea',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginVertical: 5,
  },
  percentageText: {
    color: 'green',
    fontSize: 12,
    fontWeight: 'bold',
  },
  overviewCompleted: {
    color: 'green',
    fontSize: 12,
  },
  overviewAdded: {
    color: 'green',
    fontSize: 12,
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
  updateDate: {
    color: '#888',  
    fontSize: 13,
    fontWeight: '400',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 10,
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
    left: 130,
    width: 120,
    zIndex: 1,
  },
  dropdownBox: {
    width: '50%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    left: 100,
    bottom: 32,
  },
  dropdownText: {
    fontSize: 14,
  },
});

export default SupplierDashboard;
