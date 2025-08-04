import prisma from "@packages/libs/prisma";

export const updateUserAnalytics = async (event: any) => {
  try {
    const existingData = await prisma.userAnalytics.findUnique({
      where: {
        userId: event.userId,
      },
      select:{
        actions:true,
      }
    });

    let updatedActions: any[] = existingData?.actions || [];

    const actionExists = updatedActions.some(
      (entry: any) =>
        entry.productId === event.productId && entry.action === event.action
    );

    //always store 'product_view' events for recommendation
    if (event.action === "product_view") {
      updatedActions.push({
        productId: event?.productId,
        shopId: event?.shopId,
        action: event?.action,
        timestamp: new Date().toISOString(),
      });
    } else if (
      ["add_to_cart", "add_to_wishlist"].includes(event.action) &&
      !actionExists
    ) {
      updatedActions.push({
        productId: event?.productId,
        shopId: event?.shopId,
        action: event?.action,
        timestamp: new Date().toISOString(),
      });
    }
    //remove from add to cart when remove from cart is triggered
    else if (event.action === "remove_from_cart") {
      updatedActions = updatedActions.filter(
        (entry: any) =>
          !(
            entry.productId === event.productId &&
            entry.action === "add_to_cart"
          )
      );
    } else if (event.action === "remove_from_wishlist") {
      updatedActions = updatedActions.filter(
        (entry: any) =>
          !(
            entry.productId === event.productId &&
            entry.action === "add_to_wishlist"
          )
      );
    }

    //keep only last 100 actions(prevent storage bloat)
    if (updatedActions.length > 100) {
      updatedActions.shift();
    }

    const extraFields: Record<string, any> = {};

    if (event.country) {
      extraFields.country = event.country;
    }

    if (event.city) {
      extraFields.city = event.city;
    }

    if (event.device) {
      extraFields.device = event.device;
    }

    //update or create user analytics
    await prisma.userAnalytics.upsert({
      where: {
        userId: event.userId,
      },
      update: {
        lastVisited: new Date(),
        actions: updatedActions,
        ...extraFields,
      },
      create: {
        userId: event.userId,
        lastVisited: new Date(),
        actions: updatedActions,
        ...extraFields,
      },
    });

    //update product analytics
    await updateProductAnalytics(event);
  } catch (error) {
    console.log("Error updating user analytics:", error);
  }
};

export const updateProductAnalytics = async (event: any) => {
  try {
    if (!event.productId) return;

    //define update fields dynamically based on event type
    const updateFields: any = {};

    if (event.action === "product_view") {
      updateFields.views = {
        increment: 1,
      };
    }

    if (event.action === "add_to_cart") {
      updateFields.addCart = {
        increment: 1,
      };
    }

    if (event.action === "add_to_wishlist") {
      updateFields.wishListAdd = {
        increment: 1,
      };
    }

    if (event.action === "remove_from_cart") {
      updateFields.addCart = {
        decrement: 1,
      };
    }

    if (event.action === "remove_from_wishlist") {

      updateFields.wishListAdd = {
        decrement: 1,
      };
    }

    if (event.action === "purchase") {
      updateFields.purchase = {
        increment: 1,
      };
    }

    await prisma.productAnalytics.upsert({
      where: {
        productId: event.productId,
      },
      update: {
        lastViewedAt: new Date(),
        ...updateFields,
      },
      create:{
        productId: event.productId,
        shopId:event.shopId || null,
        views:event.action === "product_view" ? 1 : 0,
        addCart:event.action === "add_to_cart" ? 1 : 0,
        wishListAdd:event.action === "add_to_wishlist" ? 1 : 0,
        purchase:event.action === "purchase" ? 1 : 0,
        lastViewedAt:new Date(),
      }
    })


  } catch (error) {
    console.log("Error updating product analytics:", error);
  }
};
