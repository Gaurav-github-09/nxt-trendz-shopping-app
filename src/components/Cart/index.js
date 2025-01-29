import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import {FaOpencart} from 'react-icons/fa'

import {MdDelete} from 'react-icons/md'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

class Cart extends Component {
  constructor(props) {
    super(props)
    const idsForCart = localStorage.getItem('cartIds')
    const uniq = [...new Set(idsForCart.split(',') || [])] // Handle empty localStorage

    this.state = {
      initialValue: 1,
      cartIdsToBuy: uniq,
      idsList: [], // Initialize as an empty array
      isLoading: false, // Flag for loading state
      error: null, // Store any errors during data fetching
    }
  }

  componentDidMount() {
    this.setState({isLoading: true}) // Set loading state before fetching

    const {cartIdsToBuy} = this.state
    Promise.all(cartIdsToBuy.map(id => this.getProductItemDetails(id)))
      .then(productDetails => {
        this.setState({idsList: productDetails, isLoading: false})
      })
      .catch(error => {
        console.error('Error fetching product details:', error)
        this.setState({isLoading: false, error})
      })
  }

  getProductItemDetails = async id => {
    const jwtToken = Cookies.get('jwt_token')

    const pathid = parseInt(id, 10)

    if (typeof pathid !== 'number') {
      return null
    }

    const apiUrl = `https://apis.ccbp.in/products/${pathid}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()

      const prodDetails = {
        id: fetchedData.id,
        brand: fetchedData.brand,
        imageUrl: fetchedData.image_url,
        price: fetchedData.price,
        rating: fetchedData.rating,
        title: fetchedData.title,
      }

      return prodDetails
    }
    return null
  }

  plusClicked = () => {
    this.setState(prev => ({initialValue: prev.initialValue + 1}))
  }

  minusClicked = () => {
    const {initialValue} = this.state

    if (initialValue > 1) {
      this.setState(prev => ({initialValue: prev.initialValue - 1}))
    } else {
      this.setState({initialValue: 1})
    }
  }

  deleteId = id => {
    const {idsList} = this.state
    const updated = idsList.filter(each => {
      if (each !== null) {
        return each.id !== id
      }
      return false
    })
    const idsUpdated = updated.map(each => each.id)

    this.setState({idsList: updated}, this.getProductItemDetails)
    localStorage.setItem('cartIds', idsUpdated)
  }

  getStyles = each => {
    const {title, brand, imageUrl, price, id} = each

    const onClickDeleteicon = () => this.deleteId(id)

    return (
      <li className="listelCart" key={id}>
        <img className="logoCart" src={imageUrl} alt={title} />
        <div className="cartdiv1">
          <h1 className="cartTitle">{title}</h1>
          <p className="brandcart">By {brand}</p>
          <p className="priceCart">Rs {price}/-</p>
        </div>
        <div className="btnContLastCont">
          <button
            onClick={this.minusClicked}
            className="plusDashbtn"
            data-testid="minus"
            type="button"
          >
            <BsDashSquare className="dashPlus plusDashbtnCart" />
          </button>
          <p className="spacedInit">1</p>
          <button
            onClick={this.plusClicked}
            className="plusDashbtn"
            data-testid="plus"
            type="button"
          >
            <BsPlusSquare className="dashPlus plusDashbtnCart" />
          </button>
        </div>
        <div>
          <button
            onClick={onClickDeleteicon}
            type="button"
            className="deleteCart"
          >
            <MdDelete className="deleteCartIcon" />
          </button>
        </div>
      </li>
    )
  }

  redirectToShopping = () => {
    const {history} = this.props

    history.replace('/products')
  }

  getPrice = each => {
    if (each === null) {
      return 0
    }
    return each.price
  }

  render() {
    const {idsList, isLoading, error} = this.state
    const updatedListOfIds = idsList.filter(each => {
      if (each !== null) {
        return true
      }
      return false
    })
    let price = 0
    const totalPrice = updatedListOfIds.map(each => this.getPrice(each))
    totalPrice.forEach(num => {
      price += num
    })

    const gst = Math.round(0.18 * price)

    if (updatedListOfIds.length === 0) {
      return (
        <>
          <Header />
          <div className="mainContPID">
            <img
              className="errorimgCart"
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
              alt="failure view"
            />
            <h1>No items in Cart</h1>
            <button
              className="ContinueShop margineffect"
              onClick={this.redirectToShopping}
              type="button"
            >
              Continue Shopping
            </button>
          </div>
        </>
      )
    }
    return (
      <>
        <Header />
        <div className="maincont1">
          <h1 className="itemsIn">Items in Cart & Billing </h1>
          <FaOpencart className="cartIconstyle" />
        </div>
        <div className="cart-container">
          <div className="cart1">
            {isLoading && (
              <Loader type="ThreeDots" color="#00BFFF" height={80} width={80} />
            )}
            {error && <p>Error fetching product details: {error.message}</p>}
            {
              <ul className="unorderedCart">
                {updatedListOfIds.map(each => this.getStyles(each))}
              </ul>
            }
          </div>
          <div className="cart2">
            <h1 className="AmtP">Amount To Pay</h1>
            <p className="billAmnt">
              Bill Amount: <span className="specSTYLEcar">Rs {price} /-</span>
            </p>
            <p className="billAmnt">
              Gst amount (18%):
              <span className="specSTYLEcar">Rs {gst} /-</span>
            </p>

            <p className="billAmnt">
              Total Amount:
              <span className="specSTYLEcar">Rs {price + gst + 50} /-</span>
            </p>
            <button className="ContinueShop finalAndLatbtn" type="button">
              Proceed to Pay
            </button>
          </div>
        </div>
      </>
    )
  }
}

export default withRouter(Cart)
