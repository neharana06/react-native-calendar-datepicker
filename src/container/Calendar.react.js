/**
* Calendar container component.
* @flow
*/

console.ignoredYellowBox = ['Warning: Overriding '];

import React, { Component, PropTypes } from 'react';
import {
  LayoutAnimation,
  Slider,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView
} from 'react-native';

// Component specific libraries.
import _ from 'lodash';
import Moment from 'moment';
// Pure components importing.
import YearSelector from '../pure/YearSelector.react';
import MonthSelector from '../pure/MonthSelector.react';
import DaySelector from '../pure/DaySelector.react';

type Stage = "day" | "month" | "year";
const DAY_SELECTOR : Stage = "day";
const MONTH_SELECTOR : Stage = "month";
const YEAR_SELECTOR : Stage = "year";

// Unicode characters
const LEFT_CHEVRON = '\u276E';
const RIGHT_CHEVRON = '\u276F';

type Props = {
  // The core properties.
  selected?: Moment,
  onChange?: (date: Moment) => void,
  slideThreshold?: number,
  // Minimum and maximum date.
  minDate: Moment,
  maxDate: Moment,
  // The starting stage for selection. Defaults to day.
  // Can be overwritten by finalStage.
  startStage: Stage,
  // The final stage for selection. Default to day. If month then the user will
  // not be able to select the month.
  finalStage: Stage,
  // General styling properties.
  style?: View.propTypes.style,
  barView?: View.propTypes.style,
  barText?: Text.propTypes.style,
  stageView?: View.propTypes.style,
  showArrows: boolean,
  // Styling properties for selecting the day.
  dayHeaderView?: View.propTypes.style,
  dayHeaderText?: Text.propTypes.style,
  dayRowView?: View.propTypes.style,
  dayView?: View.propTypes.style,
  daySelectedView?: View.propTypes.style,
  dayText?: Text.propTypes.style,
  dayTodayText?: Text.propTypes.style,
  daySelectedText?: Text.propTypes.style,
  dayDisabledText?: Text.propTypes.style,
  // Styling properties for selecting the month.
  monthText?: Text.propTypes.style,
  monthDisabledText?: Text.propTypes.style,
  monthSelectedText?: Text.propTypes.style,
  // Styling properties for selecting the year.
  yearMinTintColor?: string,
  yearMaxTintColor?: string,
  yearSlider?: Slider.propTypes.style,
  yearText?: Text.propTypes.style,
};
type State = {
  stage: Stage,
  // Focus points to the first day of the month that is in current focus.
  focus: Moment,
  monthOffset?: number,
};

export default class Calendar extends Component {
  props: Props;
  state: State;
  static defaultProps: Props;

  constructor(props: Props) {
    super(props);
    const stage = String(props.startStage) < String(props.finalStage) ?
                  props.finalStage : props.startStage;
    this.state = {
      stage: stage,
      focus: props.selected,
      timeSlot: [ "6:00 AM - 7:00 AM","7:00 AM - 8:00 AM", '9:00 AM - 10:00 AM', '11:00 AM - 12:00 AM', '12:00 PM - 1:00 PM', '1:00 PM - 2:00 PM', '2:00 PM - 3:00 PM']
    }
  }

  _stageText = () : string => {
     return this.state.focus
  }

  _previousStage = () : void => {
    if (this.state.stage === DAY_SELECTOR) {
      this.setState({stage: MONTH_SELECTOR})
    }
    if (this.state.stage === MONTH_SELECTOR) {
      this.setState({stage: YEAR_SELECTOR})
    }
    LayoutAnimation.easeInEaseOut();
  };

  _nextStage = () : void => {
    if (this.state.stage === MONTH_SELECTOR) {
      this.setState({stage: DAY_SELECTOR})
    }
    if (this.state.stage === YEAR_SELECTOR) {
      this.setState({stage: MONTH_SELECTOR})
    }
    LayoutAnimation.easeInEaseOut();
  };

  _previousMonth = () : void => {
    this.setState({focus:Moment(this.state.focus).subtract(1, 'days').format("MMMM DD, YYYY")});
  };

  _nextMonth = () : void => {
     this.setState({focus:Moment(this.state.focus).add(1, 'days').format("MMMM DD, YYYY")});
  };

  render() {
    const barStyle = StyleSheet.flatten([styles.barView, this.props.barView]);
    const previousDay = Moment(this.state.focus).subtract(1, 'day');
    const previousDayValid = this.props.minDate.diff(Moment(previousDay).endOf('day'), 'seconds') <= 0;
    const nextDay = Moment(this.state.focus).add(1, 'day');
    const nextDayValid = this.props.maxDate.diff(Moment(nextDay).startOf('day'), 'seconds') >= 0

    return (
      <View style={[{
        minWidth: 300,
        // Wrapper view default style.
      },this.props.style]}>
        <View style={{
          flexDirection: 'row'
        }}>
          <View style={[styles.barView, this.props.barView]}>
            { this.state.stage === DAY_SELECTOR && previousDayValid ?
              <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={this._previousMonth}
              >
              <Image style={{marginTop:10}} source={require('./icons8-back-to.png')} />
              </TouchableOpacity> :
              <TouchableOpacity
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  underlayColor={barStyle ? barStyle.backgroundColor : 'transparent'}
                >
               <Image style={{marginTop:10}} source={require('./icons8-back-to-40.png')} />
               </TouchableOpacity>
            }
            <View style={{flexDirection:'column',alignItems:'center'}}>
            <View style={{flexDirection:'row'}}>
             {
             this.state.focus === Moment().format("MMMM DD, YYYY") ?
             <Text style={this.props.barText}>Today,
             </Text>: <View/>
             }
             {
              this.state.focus === Moment().add(1,'days').format("MMMM DD, YYYY") ?
              <Text style={this.props.barText}>Tomorrow,
              </Text>: <View/>
             }
             <Text style={this.props.barText}>{Moment(this.state.focus).format('dddd')}</Text>
             </View>
            <TouchableOpacity
              activeOpacity={this.state.stage !== YEAR_SELECTOR ? 0.8 : 1}
              style={{ alignSelf: 'center' }}
             >
              <Text style={this.props.barText}>
              {this._stageText()}
              </Text>
            </TouchableOpacity>
            </View>
            { this.state.stage === DAY_SELECTOR && nextDayValid ?
              <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={this._nextMonth}
              >
               <Image style={{marginTop:10}} source={require('./icons8-next-page.png')} />
              </TouchableOpacity> :
              <TouchableOpacity
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  underlayColor={barStyle ? barStyle.backgroundColor : 'transparent'}
               >
              <Image style={{marginTop:10}} source={require('./icons8-next-page-40.png')} />
              </TouchableOpacity>
            }
          </View>
        </View>
        <ScrollView>
        <View style={{ flexDirection:'column', alignItems:'center', marginTop:5}}>
        {
           this.state.timeSlot.map((data,index) => (
                <TouchableOpacity key={index} onPress={ () => this.props.selectDateTimeSlot({'time':data, 'date':this.state.focus}) }><Text style={{fontSize:16,marginTop:15,fontFamily:'Arial'}}>{data}</Text></TouchableOpacity>
            ))
        }
        </View>
        </ScrollView>
      </View>
    );
  }
}
Calendar.defaultProps = {
  minDate: Moment(),
  maxDate: Moment().add(10, 'years'),
  startStage: DAY_SELECTOR,
  finalStage: DAY_SELECTOR,
  showArrows: true,
};

const styles = StyleSheet.create({
  barView: {
    flexGrow: 1,
    flexDirection: 'row',
    backgroundColor:'white',
    paddingTop:10,
    paddingBottom:10,
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    marginTop:20,
    shadowColor: "#000",
    shadowOffset: {
   	 width: 0,
   	 height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22
  },
  nextStage: {
    padding: 5,
    alignItems: 'center',
  },
  stageWrapper: {
    padding: 5,
    overflow: 'hidden',
  }
});
