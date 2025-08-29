import RankingFactory from '../factory/Ranking.js'

const getAllRankings = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query
    const options = { limit: parseInt(limit), offset: parseInt(offset) }
    const result = await RankingFactory.getAll(options)
    return res.status(200).json(result)
  } catch (error) {
    console.error('Error getting all rankings:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const getRankingById = async (req, res) => {
  try {
    const { id } = req.params
    const ranking = await RankingFactory.getById(id)
    
    if (!ranking) {
      return res.status(404).json({ message: 'Ranking no encontrado' })
    }
    
    return res.status(200).json(ranking)
  } catch (error) {
    console.error('Error getting ranking by ID:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const getUserRanking = async (req, res) => {
  try {
    const userId = req.user.id
    const ranking = await RankingFactory.getByUserId(userId)
    
    if (!ranking) {
      return res.status(404).json({ message: 'Ranking no encontrado para este usuario' })
    }
    
    return res.status(200).json(ranking)
  } catch (error) {
    console.error('Error getting user ranking:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const getSpecificUserRanking = async (req, res) => {
  try {
    const { userId } = req.params
    const ranking = await RankingFactory.getByUserId(userId)
    
    if (!ranking) {
      return res.status(404).json({ message: 'Ranking no encontrado para este usuario' })
    }
    
    return res.status(200).json(ranking)
  } catch (error) {
    console.error('Error getting specific user ranking:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const getTopPlayers = async (req, res) => {
  try {
    const { limit = 10 } = req.query
    const rankings = await RankingFactory.getTopPlayers(parseInt(limit))
    return res.status(200).json(rankings)
  } catch (error) {
    console.error('Error getting top players:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const recalculateAllRanks = async (req, res) => {
  try {
    await RankingFactory.recalculateRanks()
    return res.status(200).json({ message: 'Rankings recalculados correctamente' })
  } catch (error) {
    console.error('Error recalculating ranks:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export {
  getAllRankings,
  getRankingById,
  getUserRanking,
  getSpecificUserRanking,
  getTopPlayers,
  recalculateAllRanks
}
