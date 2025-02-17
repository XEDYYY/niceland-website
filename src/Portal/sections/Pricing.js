import { BsCheck2All } from "react-icons/bs"
import React, { useEffect, useState } from "react";
import { useNavigate, } from "react-router-dom";
import STORE from "../../store";
import { ImArrowRight2 } from "react-icons/im"
import dayjs from "dayjs";
import PulseLoader from "react-spinners/PulseLoader";
import { CLIENT } from "../../lib/api";

const subs = [
  {
    ix: 0,
    price: 8,
    OPrice: 10,
    P2Price: 8,
    OP2Price: 10,
    title: "1 Month",
    type: 1,
    discount: 20,
    P2discount: 20
  },
  {
    ix: 1,
    price: 6.4,
    OPrice: 8,
    P2Price: 36,
    OP2Price: 48,
    title: "6 Months",
    type: 2,
    discount: 20,
    P2discount: 25
  },
  {
    ix: 2,
    price: 4.8,
    OPrice: 6,
    P2Price: 54,
    OP2Price: 72,
    title: "12 Months",
    type: 3,
    discount: 20,
    P2discount: 25
  },

]


const useForm = () => {

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();


  // PAYMENTS
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({})
  const [response, setResponse] = useState(undefined)
  const [affiliate, setAffiliate] = useState(undefined)
  const [discount, setDiscount] = useState(0)
  const [period, setPeriod] = useState(1)
  // SubType      int    `json:"subtype"`
  // Period       int    `json:"period"`
  // Email        string `json:"email"`
  // Card         string `json:"card"`
  // Month        int    `json:"month"`
  // Year         int    `json:"year"`
  // CVC          string `json:"cvc"`
  // DiscountCode string `json:"discountcode"`
  const [sub, setSub] = useState(subs[0])

  const SetSub = (index, period, dc) => {
    if (period === 2) {
      setPeriod(2)
    } else {
      setPeriod(1)
    }
    // let newSub = undefined
    // if (period === 2) {
    //   newSub = { ...upfrontSubs[index] }
    // } else {
    let newSub = { ...subs[index] }
    // }

    if (!inputs["discountcode"] || inputs["discountcode"] === "") {
      console.log("CLEARING AFFILIATE")
      setAffiliate(undefined)
      setDiscount(0)
    }

    if (affiliate) {
      console.log("HAS AFFILIATE!")
      dc = affiliate.Discount
    } else if (dc) {

    } else {
      if (period === 1) {
        dc = newSub.discount
      } else if (period === 2) {
        dc = newSub.P2discount
      } else {
        dc = newSub.discount
      }
    }


    let x = 1 - (dc / 100)
    console.log("DISCOUNT: ", x)
    if (period === 2) {
      newSub.P2Price = newSub.OP2Price * x
      console.log("FINAL PRICE: ", newSub.P2Price)
    } else {
      newSub.price = newSub.OPrice * x
      console.log("FINAL PRICE: ", newSub.price)
    }

    newSub.price = parseFloat(newSub.price.toFixed(2))
    newSub.P2Price = parseFloat(newSub.P2Price.toFixed(2))


    setSub(newSub)

  }

  const handleCardinputChange = (event) => {
    event.persist();
    let replaced = event.target.value.replaceAll("-", "")
    let data = replaced.split("")
    let x1 = []
    let x2 = []
    let x3 = []
    let x4 = []
    let x5 = []
    if (replaced.length > 4) {
      x2.push("-")
    }
    if (replaced.length > 8) {
      x3.push("-")
    }
    if (replaced.length > 12) {
      x4.push("-")
    }
    if (replaced.length > 16) {
      x5.push("-")
    }

    let count = 0
    data.forEach(c => {
      if (count < 4) {
        x1.push(c)
      } else if (count <= 7) {
        x2.push(c)
      } else if (count <= 11) {
        x3.push(c)
      } else if (count <= 15) {
        x4.push(c)
      } else if (count <= 19) {
        x5.push(c)
      }

      count++
    })

    x1 = x1.concat(x2)
    x1 = x1.concat(x3)
    x1 = x1.concat(x4)
    x1 = x1.concat(x5)
    setInputs(inputs => ({ ...inputs, ["card"]: x1.join("") }));
  }

  const GetAffiliateDiscount = async () => {

    let form = {
      period: period,
      subtype: sub.type,
      discountcode: inputs["discountcode"],
    }

    console.log("SENDING FORM!")
    console.table(form)
    try {
      setLoading(true)

      const r = await CLIENT.post("https://pay.nicelandvpn.is:444/affiliate", JSON.stringify(form));
      const xd = await r.data

      setAffiliate(xd)
      console.log("DONE")
      errors["discountcode"] = ""
      setErrors({ ...errors })

      setDiscount(xd.Discount)

      SetSub(sub.ix, period, xd.Discount)

    } catch (error) {
      console.dir(error)
      let errors = {}
      if (error.response?.data) {
        errors["discountcode"] = error.response.data
        setErrors({ ...errors })
      } else {
        errors["discountcode"] = "Unknown error, please try again"
        setErrors({ ...errors })
      }
    }

    setLoading(false)
  }
  // https://pay.nicelandvpn.is/verify
  const handleSubmit = async () => {

    let errors = {}
    let hasErrors = false


    if (!inputs["email"] || inputs["email"] === "") {
      errors["email"] = "Email/Username missing"
      hasErrors = true
    }

    if (!inputs["card"] || inputs["card"] === "") {
      errors["card"] = "Card details missing"
      hasErrors = true
    }
    if (!inputs["month"] || inputs["month"] === "") {
      errors["month"] = "Expiration month missing"
      hasErrors = true
    }
    if (!inputs["year"] || inputs["year"] === "") {
      errors["year"] = "Expiration year missing"
      hasErrors = true
    }

    if (inputs["year"] && inputs["year"] !== "") {
      if (inputs["year"].length > 2) {
        errors["year"] = "Year should only be two digits"
        hasErrors = true
      }
    }

    if (!inputs["CVC"] || inputs["CVC"] === "") {
      errors["CVC"] = "CVC missing"
      hasErrors = true
    }

    let yearx = dayjs().year()
    if (yearx > Number("20" + inputs["year"])) {
      errors["year"] = "Invalid year"
      hasErrors = true
    }

    if (!sub) {
      errors["card"] = "Subscription information missing, please select your subscription again from the pricing page"
      hasErrors = true
    }

    if (hasErrors) {
      setErrors({ ...errors })
      return
    }


    setLoading(true)

    let form = {
      period: period,
      subtype: sub.type,

      cvc: inputs["CVC"],
      card: inputs["card"].replaceAll("-", ""),
      email: inputs["email"],
      month: Number(inputs["month"]),
      year: Number("20" + inputs["year"]),
      discountcode: inputs["discountcode"],
    }

    try {

      const r = await CLIENT.post("https://pay.nicelandvpn.is:444/verify", JSON.stringify(form));
      const xd = await r.data

      setResponse(xd)

    } catch (error) {
      let errors = {}
      if (error.response?.data) {
        errors["response"] = error.response.data
        setErrors({ ...errors })
      }
    }

    setLoading(false)
  }

  const handleInputChange = (event) => {
    if (affiliate) {
      if (event.target.id === "discountcode") {
        setAffiliate(undefined)
        setDiscount(0)
        SetSub(sub.ix, period)
      }
    }
    // TODO .. input verification for stuff
    setInputs(inputs => ({ ...inputs, [event.target.id]: event.target.value }));
  }


  return {
    inputs,
    setInputs,
    handleInputChange,
    handleSubmit,
    errors,
    navigate,
    loading,
    response,
    handleCardinputChange,
    sub,
    SetSub,
    GetAffiliateDiscount,
    discount,
    setPeriod,
    period
  };
}


const Pricing = (props) => {

  const { inputs, setInputs, handleInputChange, handleSubmit, errors, navigate, loading, response, handleCardinputChange, sub, SetSub, GetAffiliateDiscount, discount, period, setPeriod } = useForm();

  const NavigateToCashPayments = () => {
    navigate("/cash")
  }

  const NavigateToRegister = () => {
    navigate("/register")
  }

  useEffect(() => {
    if (!inputs["email"]) {
      let user = STORE.SessionCache.Get("x")
      if (user) {
        handleInputChange({ target: { id: "email", value: user } })
      }
    }

    let code = STORE.Cache.Get("code")
    if (!inputs["discountcode"] && code) {
      if (code === undefined || inputs["discountcode"] === undefined || inputs["discountcode"] === "undefined" || code === "undefined") {

      } else {

        handleInputChange({ target: { id: "discountcode", value: code } })
      }
    }

  }, [])


  // console.table(inputs)
  // console.table(errors)
  // console.table(sub)

  return (
    <>
      <div className={`pricing-tabs grid-row-${props.row} inherit-grid bg-${props.bg}`} >
        <div className="announcement">Limited Time 20% Launch Discount!</div>
      </div>



      <div className={`pricing grid-row-${props.row} inherit-grid  bg-${props.bg}`} >
        <div className="sub-select"> 1. Select your subscription</div>

        <div className="sub sub-1" onClick={() => SetSub(0, 1)} >
          <div className="title">1 Month</div>
          <div className="price price-current teal">
            <span className="value">8</span>
            <span className="month">USD per month</span>
          </div>
        </div>

        <div className="sub sub-1" onClick={() => SetSub(1, 1)}>
          <div className="title">6 Months</div>
          <div className="price price-current teal">
            <span className="value">6.4</span>
            <span className="month">USD per month</span>
          </div>
        </div>

        <div className="sub sub-1" onClick={() => SetSub(2, 1)}>
          <div className="title">12 Months</div>
          <div className="price price-current teal">
            <span className="value">4.8</span>
            <span className="month">USD per month</span>
          </div>
        </div>
      </div>

      <div className={`pricing-tabs pricing-tabs-padding-fix grid-row-${props.row} inherit-grid  bg-${props.bg}`} >
        <div className="complete-payment"> 2. Complete the payment</div>
        <div className="register">
          <a href="https://nicelandvpn.is/#/register" target="_blank">No Account? register here!</a>
        </div>
      </div>

      {response &&
        <>
          <div className="row payment-wrapper">
            {response.cardVerificationRawResponse &&
              <div className="" dangerouslySetInnerHTML={{ __html: response.cardVerificationRawResponse }}></div>
            }
          </div>
        </>
      }

      {!response &&
        <div className="row payment-wrapper">

          <div className="payment-tabs">
            <div className={`monthly ${period === 1 ? "active" : ""}`} onClick={() => SetSub(sub.ix, 1)}>Monthly</div>
            <div className={`upfront ${period === 2 ? "active" : ""}`} onClick={() => SetSub(sub.ix, 2)}>Up-front</div>
          </div>

          <div className="payment-form">

            {discount !== 0 &&
              <div className="discount">{discount}% Discount from code {inputs["discountcode"]}</div>
            }
            {(discount === 0 && period === 2 && sub.type !== 1) &&
              <div className="discount">25% Launch Discount</div>
            }
            {(discount === 0 && period === 2 && sub.type === 1) &&
              <div className="discount">20% Launch Discount</div>
            }
            {(discount === 0 && period === 1) &&
              <div className="discount">20% Launch Discount</div>
            }

            {period === 1 &&
              <div className="sub-price-original">{sub.OPrice} USD</div>
            }
            {period === 2 &&
              <div className="sub-price-original">{sub.OP2Price} USD</div>
            }
            <div className="sub-type">{sub.title}</div>

            {period === 1 &&
              <div className="sub-price">{sub.price} USD</div>
            }
            {period === 2 &&
              <div className="sub-price">{sub.P2Price} USD</div>
            }

            <div className="seperator"></div>

            {errors["response"] &&
              <div className="payment-item">
                <label for="response" className="label error">{errors["response"]}</label>
              </div>
            }

            <div className="payment-item">
              <label for="email" class="label">{errors["email"] ? <span className="error">{errors["email"]}</span> : "Email or Username"}</label>
              <input type="email" value={inputs["email"]} class="input" id="email" onChange={handleInputChange} />
            </div>

            <div className="payment-item">
              <label for="card" class="label">Card Information</label>
              <input type="card" value={inputs["card"]} class="input" id="card" onChange={handleCardinputChange} placeholder="Card Number" />
            </div>

            <div className="payment-item-small">
              <input type="text" value={inputs["month"]} class="input input-small" id="month" onChange={handleInputChange} placeholder="MM" />

              <input type="text" value={inputs["year"]} class="input input-small" id="year" onChange={handleInputChange} placeholder="YY" />

              <input type="text" value={inputs["CVC"]} class="input input-small" id="CVC" onChange={handleInputChange} placeholder="CVC" />
            </div>

            <div className="payment-item">
              <label for="discountcode" class="label">{errors["discountcode"] ? <span className="error">{errors["discountcode"]}</span> : "Discount / Affiliate Code"}</label>
              <input type="discountcode" value={inputs["discountcode"]} class="input" id="discountcode" onChange={handleInputChange} />
            </div>
            {(inputs["discountcode"] && inputs["discountcode"] !== "") &&
              <div className="getcode confirm-button" onClick={() => GetAffiliateDiscount()}>Get Code Discount</div>
            }

            <label for="month" class="label label-small">{errors["card"] ? <span className="error">{errors["card"]}</span> : ""}</label>
            <label for="month" class="label label-small">{errors["month"] ? <span className="error">{errors["month"]}</span> : ""}</label>
            <label for="month" class="label label-small">{errors["year"] ? <span className="error">{errors["year"]}</span> : ""}</label>
            <label for="month" class="label label-small">{errors["CVC"] ? <span className="error">{errors["CVC"]}</span> : ""}</label>


            <br />
            <label className="label terms">By pressing confirm you accept our {` `}
              <a href="https://docs.google.com/viewer?url=https://raw.githubusercontent.com/tunnels-is/media/master/terms/terms.pdf" target="_blank">
                Terms And Conditions
              </a>
            </label>
            {period === 1 &&
              <label className="label terms">Monthly subscriptions are binding for the duration of the subscription</label>
            }


            {loading &&
              <PulseLoader
                size={20}
                color={"#0E918D"}
              ></PulseLoader>
            }

            {!loading &&
              <div className="confirm-button" onClick={() => handleSubmit()}>
                Confirm
                <ImArrowRight2 className="arrow" size={15}></ImArrowRight2>
              </div>
            }

          </div>



        </div >
      }


      <div className={`pricing-desc grid-row-${props.row} inherit-grid  bg-${props.bg}`} >

        <div className="title font-section-title">Subscription Benefits</div>
        <div className="subtitle font-section-subtitle">All subscriptions have access to our full list of features and the following support platforms</div>

        <div className="benefits font-section-subtitle">
          <div className="item">Email</div>
          <div className="item">Telegram</div>
          <div className="item">Slack</div>
          <div className="item">Discord</div>
          <div className="item">Element / Matrix</div>
          <div className="item">Reddit</div>
        </div>
      </div>
    </>


  );
}

export default Pricing;