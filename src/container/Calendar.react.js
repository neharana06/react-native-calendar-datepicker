import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Modal,
  View,
  ListView,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import Calendar from 'react-native-calendar-datepicker';
import styles from './style.js'
import Moment from 'moment';


export default class ModalSortBy extends Component {
  constructor (props, ctx) {
    super(props, ctx)

    this.state = {
      date: Moment().toISOString(),
    }
  }

  componentWillReceiveProps (newProps) {
    if ((!this.props.visible && newProps.visible) || (this.props.options !== newProps.options)) {
      this.setState({
        filter: '',
      })
    }
  }

  render () {
    const {
      title,
      titleTextStyle,
      overlayStyle,
      cancelContainerStyle,
      renderCancelButton,
      renderList,
      visible,
      modal,
      onCancel
    } = this.props


    return (
      <Modal
        onRequestClose={onCancel}
        {...modal}
        visible={visible}
        supportedOrientations={['portrait', 'landscape']}
      >
        <KeyboardAvoidingView
          behavior="padding"
          style={overlayStyle || styles.overlay}
          enabled={Platform.OS === 'ios'}
        >
         <View></View>
                   {(renderList || this.renderList)()}
                   <View style={cancelContainerStyle || styles.cancelContainer}>
                     {(renderCancelButton || this.renderCancelButton)()}
                   </View>
        </KeyboardAvoidingView>
      </Modal>
    )
  }

  renderList = () => {
    const {
      showFilter,
      autoFocus,
      listContainerStyle,
      androidUnderlineColor,
      placeholderText,
      placeholderTextColor,
      filterTextInputContainerStyle,
      filterTextInputStyle
    } = this.props

    return (
      <View style={listContainerStyle || styles.listContainer}>
      <Text style={{color: 'grey',fontSize: 20,marginTop:20, marginLeft:15}}>Choose A Slot</Text>
      <View
        style={{
          borderBottomColor: 'grey',
          borderBottomWidth: 0.5,
          marginLeft:10,
          marginRight:10,
          marginTop:20
        }}
      />
      <Calendar
      selectDateTimeSlot={this.selectDateTimeSlot}
      minDate={Moment()}
      maxDate={Moment().add(6, 'days')}
      selected={Moment(this.state.date).format("MMMM DD, YYYY")}
      style={{
        borderColor: 'transparent',
        alignSelf: 'center',
        width: 330,
      }}
      barView={{
        backgroundColor: 'rgb(98,190,223)',
        padding: 10,
      }}
      barText={{
        fontSize: 21,
        fontWeight: 'bold',
        color: '#FFFFFF',
      }}
      stageView={{
        padding: 0,
      }}
      dayHeaderView={{
        backgroundColor: 'rgb(98,190,223)',
        borderBottomColor: 'transparent',
      }}
      dayHeaderText={{
        fontSize: 15,
        fontWeight: 'bold',
        color: '#FFFFFF',
      }}
      dayRowView={{
        borderColor: 'transparent',
        height: 40,
      }}
      dayText={{
        fontSize: 15,
        color: 'rgb(74,74,74)',
      }}
      dayDisabledText={{
        fontSize: 15,
        color: 'rgb(200,200,200)',
      }}
      dayTodayText={{
        fontWeight: 'bold',
        color: 'blue',
      }}
      daySelectedText={{
        fontWeight: 'bold',
        backgroundColor: 'rgb(98,190,223)',
        color: '#FFFFFF',
        borderRadius: 15,
        borderColor: "transparent",
      }}
      />
      </View>
    )
  }

  selectDateTimeSlot = (value) => {
    this.props.onCancel(value)
  }

}

ModalSortBy.propTypes = {
  onCancel: PropTypes.func.isRequired,
  placeholderText: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  androidUnderlineColor: PropTypes.string,
  cancelButtonText: PropTypes.string,
  title: PropTypes.string,
  noResultsText: PropTypes.string,
  visible: PropTypes.bool,
  showFilter: PropTypes.bool,
  modal: PropTypes.object,
  selectedOption: PropTypes.string,
  renderOption: PropTypes.func,
  renderCancelButton: PropTypes.func,
  renderList: PropTypes.func,
  listViewProps: PropTypes.object,
  filterTextInputContainerStyle: PropTypes.any,
  filterTextInputStyle: PropTypes.any,
  cancelContainerStyle: PropTypes.any,
  cancelButtonStyle: PropTypes.any,
  cancelButtonTextStyle: PropTypes.any,
  titleTextStyle: PropTypes.any,
  overlayStyle: PropTypes.any,
  listContainerStyle: PropTypes.any,
  optionTextStyle:PropTypes.any,
  selectedOptionTextStyle:PropTypes.any,
  keyboardShouldPersistTaps: PropTypes.string
}

ModalSortBy.defaultProps = {
  placeholderText: 'Filter...',
  placeholderTextColor: '#ccc',
  androidUnderlineColor: 'rgba(0,0,0,0)',
  cancelButtonText: 'Cancel',
  noResultsText: 'No matches',
  visible: true,
  showFilter: true,
  keyboardShouldPersistTaps: 'never'
}
