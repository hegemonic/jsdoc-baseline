{% if summaryItems && summaryItems.length %}
    <div {{ cssClass('!summary-callout') }}>
        {% if summaryHeadingKey %}
            {% set headingText = translate(summaryHeadingKey, summaryItems.length) %}
            <h {{ cssClass('!summary-callout-heading') }}>{{ headingText }}</h>
        {% endif %}
        <div {{ cssClass('!summary-content') }}>
            {% set COLUMN_COUNT = 3 %}
            {# use multiple columns only if the number of items meets the threshold #}
            {% set COLUMN_THRESHOLD = 5 %}

            {% if summaryItems.length >= COLUMN_THRESHOLD %}
                {% set itemsPerColumn = Math.ceil(summaryItems.length / COLUMN_COUNT) %}
            {% else %}
                {% set itemsPerColumn = summaryItems.length %}
            {% endif %}

            {% set columnGroups = summaryItems|group(itemsPerColumn, COLUMN_COUNT) %}
            {% for columnGroup in columnGroups %}
                {% include 'summarycolumn.swig' %}
            {% endfor %}
        </div>
    </div>
{% endif %}
