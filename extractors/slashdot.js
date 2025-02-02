const extractor = () => {
    async function get_posts(page = 0, request = null, args = null) {
        return await fetch(`https://slashdot.org/?desktop=1&page=${page}`)
            .then(res => res.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/html"))
            .then(dom => [...dom.querySelectorAll("article[id^='firehose']")])
            .then(posts => posts.map(post => ({
                title: post.querySelector(".story-title>a").textContent,
                author: "Slashdot",
                url: post.querySelector(".story-sourcelnk") ? post.querySelector(".story-sourcelnk").href : post.querySelector(".story-title>a").href,
                id: post.querySelector(".story-title>a").pathname.split("/").slice(0, -1).join("/"),
                dt: post.querySelector("time").dateTime,
                points: 0,
                image: "/favicon.svg",
                page: "/discover/slashdot" + post.querySelector(".story-title>a").pathname.split("/").slice(0, -1).join("/")
            })))
            .catch(err => []);
    }

    async function get_post(id, request = null, args = null) {
        return await fetch(`https://slashdot.org/api/v1/${id}.json?api_key=MdotSLEDY7Ss2nEy7Op9lkKJctCqbGjWUBAUsatNKsQ`)
            .then(res => res.json())
            .then(data => ({
                author: data.nickname,
                title: data.title,
                url: data.canonical_url,
                id: id,
                dt: data.time,
                image: "/favicon.svg",
                page: "/discover/slashdot/" + id,
            }))
            .catch(err => null);
    }

    return {
        get_posts: get_posts,
        get_post: get_post
    }
}