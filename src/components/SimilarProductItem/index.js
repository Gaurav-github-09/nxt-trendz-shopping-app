// Write your code here
import {Link} from 'react-router-dom'

import './index.css'

const SimilarProductItem = props => {
  const {similarItemsDetails, updateId} = props
  const {rating, price, imageUrl, title, brand, id} = similarItemsDetails

  const refreshId = () => {
    updateId(id)
  }

  return (
    <li onClick={refreshId} className="listEl">
      <Link className="linkel" to={`/products/${id}`}>
        <img
          className="simPrologo"
          src={imageUrl}
          alt={`similar product ${title}`}
        />
        <h1 className="simTitle">{title}</h1>
        <p className="checkBrand">by {brand}</p>
        <div className="lastandfinalCOnt">
          <p className="lasrat">RS {price}/-</p>
          <button className="starBtn " type="button">
            <p>{rating}</p>
            <img
              className="starImg"
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
            />
          </button>
        </div>
      </Link>
    </li>
  )
}

export default SimilarProductItem
