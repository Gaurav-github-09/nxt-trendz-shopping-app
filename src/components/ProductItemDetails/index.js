// Write your code here
import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productDetails: [],
    similarItems: [],
    initialValue: 1,
    idUpdate: '',
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getProductItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    window.scrollTo(0, 0)

    const {history} = this.props

    const {idUpdate} = this.state

    const jwtToken = Cookies.get('jwt_token')

    let apiUrl = `https://apis.ccbp.in${history.location.pathname}`

    if (idUpdate !== '') {
      apiUrl = `https://apis.ccbp.in/products/${idUpdate}`
    }

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()

      const updatedProdDetails = {
        availability: fetchedData.availability,
        brand: fetchedData.brand,
        description: fetchedData.description,
        id: fetchedData.id,
        imageUrl: fetchedData.image_url,
        price: fetchedData.price,
        rating: fetchedData.rating,
        style: fetchedData.style,
        title: fetchedData.title,
        totalReviews: fetchedData.total_reviews,
      }

      const updatedSimilarItems = fetchedData.similar_products.map(each => ({
        availability: each.availability,
        brand: each.brand,
        description: each.description,
        id: each.id,
        imageUrl: each.image_url,
        price: each.price,
        rating: each.rating,
        style: each.style,
        title: each.title,
        totalReviews: each.total_reviews,
      }))

      this.setState({
        apiStatus: apiStatusConstants.success,
        similarItems: updatedSimilarItems,
        productDetails: updatedProdDetails,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  gotID = id => {
    this.setState({idUpdate: id}, this.getProductItemDetails)
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

  addToCartClicked = () => {
    const {history} = this.props

    const idAdd = history.location.pathname.slice(
      10,
      history.location.pathname.length,
    )
    const idsForCart = localStorage.getItem('cartIds')

    const uniq = [...new Set(idsForCart.split(',')), idAdd]

    // console.log([...parsedIdssList, idAdd])

    // const uniq = [...new Set(resultCheck)]

    // console.log(resultCheck)

    localStorage.setItem('cartIds', uniq)

    // localStorage.removeItem('cartIds')
  }

  ProductItemDetails = () => {
    const {productDetails, similarItems, initialValue} = this.state

    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = productDetails

    return (
      <div className="PRodCont">
        <div className="cont1">
          <img className="PRdoImgMain" src={imageUrl} alt="product" />
          <div className="Bordercont">
            <h1 className="title">{title}</h1>
            <p className="price">Rs {price}/-</p>
            <div className="buttonCont">
              <button className="starBtn" type="button">
                <p>{rating}</p>
                <img
                  className="starImg"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </button>
              <p className="totalReviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <div className="avaiCont">
              <h1 className="avaHead">Available:</h1>
              <p className="description desc2">{availability}</p>
            </div>
            <div className="avaiCont">
              <h1 className="avaHead">Brand:</h1>
              <p className="description desc2">{brand}</p>
            </div>
            <div className="btnContLast">
              <button
                onClick={this.minusClicked}
                className="plusDashbtn"
                data-testid="minus"
                type="button"
              >
                <BsDashSquare className="dashPlus" />
              </button>
              <p className="initial">{initialValue}</p>
              <button
                onClick={this.plusClicked}
                className="plusDashbtn"
                data-testid="plus"
                type="button"
              >
                <BsPlusSquare className="dashPlus" />
              </button>
            </div>
            <button
              onClick={this.addToCartClicked}
              className="AddtoCart"
              type="button"
            >
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="SimilarProd">Similar Products</h1>
        <ul className="UNordered">
          {similarItems.map(each => (
            <SimilarProductItem
              updateId={this.gotID}
              key={each.id}
              similarItemsDetails={each}
            />
          ))}
        </ul>
      </div>
    )
  }

  loader = () => (
    <div className="loaderCont" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  redirectToShopping = () => {
    const {history} = this.props

    history.replace('/products')
  }

  noProduct = () => (
    <div className="mainContPID">
      <img
        className="errorimg"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <button
        className="ContinueShop"
        onClick={this.redirectToShopping}
        type="button"
      >
        Continue Shopping
      </button>
    </div>
  )

  apiResults = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.loader()
      case apiStatusConstants.failure:
        return this.noProduct()
      case apiStatusConstants.success:
        return this.ProductItemDetails()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="mainContPID">{this.apiResults()}</div>
      </>
    )
  }
}

export default withRouter(ProductItemDetails)
