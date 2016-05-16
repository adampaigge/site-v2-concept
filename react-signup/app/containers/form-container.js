import React from 'react'
import Formsy from 'formsy-react'
import FluxHeader from '../components/flux-header'
import MyInput from '../components/my-input'
import SectionTitle from '../components/section-title'
import HttpHelpers from '../utils/http-helpers'


const redirectUrl = window.location.href + 'step2';

const FormContainer = React.createClass({
  getInitialState() {
    return {
      canSubmit: false,
      isLoading: false,
      validationErrors: {},
      serverErrorMsg: false,
      serverSuccessMsg: false
    };
  },
  submit(data) {
    data.dob = data.dobYear + '-' + data.dobMonth + '-' + data.dobDay + 'T12:00:00';
    data.address = data.addr_street + '; ' + data.addr_suburb + '; ' + data.addr_postcode;
    this.setState({isLoading: true});
    HttpHelpers.sendForm( JSON.stringify(data, null, 4), function(response){

      if (__DEV__) {
        console.log(response);
        console.log(data);
      }


      if (response.statusText === "OK" || response.status === 200 || response.data.success === true) {
        this.setState({
          isLoading: false,
          serverSuccessMsg: "Success"
        });
        setTimeout(function() {
          window.location.assign(redirectUrl)
        }, 1500);

        // analytics and conversions
        ga('send', {
          hitType: 'event',
          eventCategory: 'Membership Form',
          eventAction: 'Submission',
        });

        fbq('track', 'Complete Registration');
        fbq('track', 'NewMember');  // a different pixel thing to the above, keep both.

      } else if (response.statusText === "Conflict" || response.status === 409 || response.data === "Email already exists. Please update details instead of re-registering.") {
        this.setState({
          isLoading: false,
          serverErrorMsg: "Error. Email already exists"
        });
      // } else if (response.data.error_args) {
      //   this.setState({
      //     isLoading: false,
      //     serverErrorMsg: "Date error. Please try a valid date"
      //   });
      } else {
        this.setState({
          isLoading: false,
          serverErrorMsg: "Server error, " + response.statusText ? response.statusText : null
        });
      }
    }.bind(this))
  },
  enableButton() {
    this.setState({ canSubmit: true });
  },
  disableButton() {
    this.setState({ canSubmit: false });
  },


  render() {
    return (
      <Formsy.Form
        onSubmit={this.submit}
        onValid={this.enableButton}
        onInvalid={this.disableButton}
        onChange={this.validateForm}>

        <div className="py3 px3 bg-light-gray">
          <h3 className="h2 regular mb1">Sign up below, its quick and easy</h3>
          <div className="gray mb3">
            <p className="mb2">
              Please make sure your details exactly match those on the electoral roll. You can confirm them on the
              <a href="https://oevf.aec.gov.au/" target="_blank" className="link-reset border-bottom accent nowrap"> AEC website</a>.
            </p>
          </div>

          <MyInput
            inputClass="checkbox"
            type="checkbox"
            name="onAECRoll"
            title="I am on the Australian Electoral Roll"
            validationError="First name is required"
            value={false} />
        </div>

        <div className="px3 pb4">
          <SectionTitle text="1. Names"/>

          <MyInput
            inputClass="input"
            name="fname"
            title="Legal First Name"
            autocomplete="given-name"
            validations="isAlpha"
            validationErrors={{
              isRequired: 'First name is required',
              isAlpha: 'Only letters please'
            }}
            required />

          <MyInput
            inputClass="input"
            name="lname"
            autocomplete="family-name"
            title="Legal Last Name"
            validations="isAlpha"
            validationErrors={{
              isRequired: 'First name is required',
              isAlpha: 'Only letters please'
            }}
            required />

            <MyInput
              inputClass="input"
              name="mname"
              autocomplete="false"
              title="Legal Middle Names"
              validations="isAlpha"
              validationErrors={{
                isAlpha: 'Only letters please'
              }}
              formNoValidate />

          <SectionTitle text="2. Address"/>
          <MyInput
            inputClass="input"
            name="addr_street"
            title="Street Address"
            validationError="Street address is required"
            autocomplete="address-line1"
            validationErrors={{
              isRequired: 'Street address required'
            }}
            required />

          <MyInput
            inputClass="input"
            name="addr_suburb"
            title="Suburb"
            validationError="Suburb required"
            autocomplete="city"
            required />

          <MyInput
            inputClass="input"
            name="addr_postcode"
            title="Postcode"
            validations="isNumeric,isLength:4"
            validationErrors={{
              isRequired: 'Postcode required',
              isNumeric: 'Only numbers allowed',
              isLength: 'Length needs to be 4 digits'
            }}
            autocomplete="postal-code"
            required />

          <SectionTitle text="3. Date of Birth" infoText="(Required by AEC)"/>
          <div className="flex mxn1">
            <div className="col-3 px1 relative">
              <MyInput
                inputClass="input"
                name="dobDay"
                title="Day"
                placeholder="DD"
                validations={{
                  isNumeric: true,
                  isLength: 2,
                  matchRegexp: /(0[1-9]|[12]\d|3[01])/
                }}
                validationErrors={{
                  isRequired: 'Day required',
                  isNumeric: 'Only numbers allowed',
                  isLength: 'Length must be 2 digits',
                  matchRegexp: 'Invalid date range'

                }}
                required />
            </div>

            <div className="col-3 px1 relative">
              <MyInput
                inputClass="input"
                name="dobMonth"
                title="Month"
                placeholder="MM"
                validations={{
                  isNumeric: true,
                  isLength: 2,
                  matchRegexp: /^(0[1-9]|1[0-2])$/
                }}
                validationErrors={{
                  isRequired: 'Month required',
                  isNumeric: 'Only numbers allowed',
                  isLength: 'Month must be 2 digits',
                  matchRegexp: 'Invalid date range'
                }}
                required />
            </div>

            <div className="col-6 px1 relative">
              <MyInput
                inputClass="input"
                name="dobYear"
                title="Year"
                placeholder="YYYY"
                validations={{
                  isNumeric: true,
                  isLength: 4,
                  matchRegexp: /^(190[0-9]|19[5-9]\d|200\d|201[0-6])$/
                }}
                validationErrors={{
                  isRequired: 'Year required',
                  isNumeric: 'Only numbers allowed',
                  isLength: 'Year must be 4 digits',
                  matchRegexp: 'Invalid date range'
                }}
                required />
            </div>

          </div>

          <SectionTitle text="4. Contact details"/>
          <MyInput
            inputClass="input"
            type="tel"
            name="contact_number"
            title="Phone"
            autocomplete="tel"
            validations={{
              minLength: 8
            }}
            validationErrors={{
              isRequired: 'Phone number is required',
              minLength: 'Needs to be at least 8 digits.'
            }}
            required />

          <MyInput
            inputClass="input"
            name="email"
            title="Email"
            validations="isEmail"
            validationError="This is not a valid email"
            autocomplete="email"
            required />

          <MyInput
            inputClass="input"
            type="checkbox"
            name="mailing-list"
            title="Send me Flux news and important updates."
            value={true}
             />

           <MyInput
             inputClass="input"
             type="checkbox"
             name="volunteer"
             title="I'm interested in volunteering."
             value={false}
              />

           <div className="buttons flex items-center mt4 mb3">
             <div>
              <button type="submit" className="h3 btn btn-primary" disabled={!this.state.canSubmit}>Submit <i className="material-icons ">chevron_right</i></button>
             </div>
            {!this.state.canSubmit
              &&
              <div className="ml2 line-height-3 flex col-6 mt1">
                <span className="h3 error inline-block">*</span>
                <p className='h5 inline error'>You can't submit until you fill out all required fields</p>
              </div>}

             {this.state.isLoading
              ?
              <div className="ml2 line-height-3 flex col-6 mt1">
                <p className='h5 inline'>Sending...</p>
              </div>
              : this.state.serverSuccessMsg
              ?
              <div className="ml2 line-height-3 flex col-6 mt1">
                <p className='h5 inline success-color'>{this.state.serverSuccessMsg}</p>
              </div>
              : this.state.serverErrorMsg && !this.state.serverSuccessMsg
              ?
              <div className="ml2 line-height-3 flex col-6 mt1">
                <span className="h3 error inline-block">*</span>
                <p className='h5 inline error'>{this.state.serverErrorMsg}</p>
              </div>
              : null}

          </div>

          <p className="silver">
            <i className="material-icons ">lock</i>
            Your details will be kept absolutely confidential and will only be used for party business.</p>
        </div>

      </Formsy.Form>
    );
  }
});

export default FormContainer;
