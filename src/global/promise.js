
import { _ } from 'lodash';

Promise.allValues = async (object) => {
  return _.zipObject(
    _.keys(object),
    await Promise.all(
      _.values(object).map((func)=>func.call())
    )
  )
}
