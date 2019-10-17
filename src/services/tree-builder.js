const arrayToTree = require('array-to-tree');

module.exports = {
    fromMagento: {
        category: function(categories) {
            categories.map(function(e){
                e.custom_attributes = null;
                delete e.custom_attributes;
                delete e.created_at;
                delete e.updated_at;
                delete e.available_sort_by;
                delete e.include_in_menu;
                delete e.path;
                delete e.children;

                return e;
            });

            return arrayToTree(categories, {
                parentProperty: 'parent_id',
                childrenProperty: 'children_data',
                customId: 'id'
            });
        }
    }
}
