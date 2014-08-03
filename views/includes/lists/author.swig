{% if author && author.length %}
    <dt>{{ translate('headings.authors', author.length) }}</dt>
    {% for singleAuthor in author %}
        <dd>{{ singleAuthor|resolveAuthorLinks|safe }}</dd>
    {% endfor %}
{% endif %}
