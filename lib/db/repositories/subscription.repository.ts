import { prisma } from '@/lib/prisma'

export const subscriptionRepository = {
  async findByUserId(userId: string) {
    return prisma.subscription.findUnique({
      where: { userId },
    })
  },

  async findByStripeCustomerId(stripeCustomerId: string) {
    return prisma.subscription.findFirst({
      where: { stripeCustomerId },
    })
  },

  async create(data: {
    userId: string
    stripeSubscriptionId: string
    stripeCustomerId: string
    status: string
    currentPeriodStart: Date
    currentPeriodEnd: Date
  }) {
    return prisma.subscription.create({
      data,
    })
  },

  async update(
    userId: string,
    data: {
      status?: string
      currentPeriodStart?: Date
      currentPeriodEnd?: Date
      stripeSubscriptionId?: string
    }
  ) {
    return prisma.subscription.update({
      where: { userId },
      data,
    })
  },

  async delete(userId: string) {
    return prisma.subscription.delete({
      where: { userId },
    })
  },
}
